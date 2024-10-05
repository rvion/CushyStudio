# Migration system

## Problem

-   we don't want to lose business data stored in our document "DB"

## Situation

Our document engine

-   CURRENTLY LACKS A PROPER MIGRATION SYSMEM

-   is schema-based

    -   and requires no schema compilation

-   has a proprieraty serial format we can modify as we want to include meta-data or versionning

    -   it means we're not storing raw JSON, but a more complex format with more information
    -   every node (list, string, number, object...) retains its type

-   can represent complex data types that have no representation in json

    -   binary data via base64 encoding
    -   ...
    -   🆘 => some of those data require a full JS runtime to be migrated.

-   is used in very iterative workflows and has a bunch of "questionable" features to go along with it

    -   currently, iterating on a schema auto-updates UI in real time without crashing
    -   currently, instances are self-healing based on their schema.

-   has **no unified storage engine.**

    -   we store some documents in localstorage
    -   some documents are never stored
    -   we store some documents in postgres

        -   sometimes in dedicated tables
        -   sometimes in sub-json fields

            ```
            Table name
            |        json column
            |        |      |
            V        V      V
            LocoUser.custom.via-ext1 <document-serial-1> // <-----|
            LocoUser.custom.via-ext2 <document-serial-2> // <---| |
            LocoUser.custom.manually <document-serial-3> // <-| | |
                                                              | | |
            two different documents stored within the same json field
            ```

            👆 HERE we can see that cutom data are attached to loco-users from three different places:

            -   via two different extensions
            -   via the UI (right click a user table > add custom field > ....)

        -   🆘 => seems too easy to accidentally override the root `custom` with new data from one of the places above and lose data from the others
        -   🆘 => we possibly can't rely on global locks
        -   🆘 => we possibly can't have DB-backed validation for some kind of constraints

-   allows schema to be re-used across different models
    -   we call them `prefabs`
    -   a "permission" prefab exported from a js module could be used in dozen of other documents.
        -   🆘 => we possibly need schema versionning
        -   🆘 => we possibly need to be able to attach migrations to prefabs

## Questions that possibly need answering

concernant les "collections" (liste de document qui partage le meme schema et qui est stocké de manière):

-   A-t'on besoin d'un concept de `collection` qui soit DB-backed ?
-   si oui, ce concept de `collection` est-t'il coté `csuite` ou coté `loco` ?
-   Migrer toute une collection d'un coup ? Ou chaque instance une par une ?

-   how to iterate on every single field with a given type, across the whole universe of documents ?
-   Quid des selects dont les options changent ? quid des refs vers des instances qui deviennent invalides ?

## BESOINS / NEEDS

_Cahier des charges fonctionnel / liste de tous les besoins validés pour ensuite planifier l'implémentation_

-   a. Passer de `b.string().optional()` à `b.string()` et vice-versa

-   b. Passser de `b.date` à `b.plainDate` et vice-versa

-   c. Passer d'un object `embedded` à une nouvelle collection à part

-   d. Changer les valeurs des enums.

-   e. Gros changement plus structurels:

    -   e.g. `string` => `{a: string, b: {a:string, at: Date}[]}`
    -   flat `{created,updated}_{at,by}` => audit prefab

-   f. Migration qui charge des données depuis une autre collection
    (ex: updatedAt qui vient du dernier enregistrement lié d'un autre collection)
    🆘 => solved by the DB collection abstraction
    🆘 => probably means that some migration can only run in the backend.

-   g. Migration liée à un prefab utilisé dans plusieurs collections
    => le préfab change de structure, il est utilisé à plusieurs endroits,
    **on ne veut écrire qu'une seule migration**

-   h. Ability to write migrations that require the backend / access DB data

-   i. Support recovering from unknown serial using codegen to assist with the migration

-   j. Ability to either crash or recover from serial that can't be migrated into a valid document.

    -   j.1. Crash when no migration/invalid migration (probably the best default):
        In many cases, if we can't get a perfectly valid document without resorting to inventing data,
        (or discarding extra data❓), we may just want to crash.

    -   j.2. in some other situations, (or possibly just as some intermediary step before we finally decide to crash),
        we may want to recover as much as possible and report the errors attached to the healed serial/document.

    We need to support both, and ensure the unsafe way to auto-heal is done explicitely.
    🔶 IN BOTH CASES, inventing random data without having a default is NEVER okay;
    we MAY want to be able to access a value that comply the schema for some purpose, but never discard the fact
    the value is invalid/the value has not been set. => which will cause a crash if accessed in (j.1) mode.

-   k. schema must remain legible through iterations. migrations must not come whith the heavy burden of obfuscating
    our schema.

<!-- 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆 -->

## High-level solution

At the csuite level, we keep the lazy migration solution.

1. csuite doesn't impose some unified storage engine and thus
   👉 can't know all documents for a given schema in its applicative universe
   👉 can't use some kind of global lock

BUT we can still have our own collection (a.k.a. custom table) abstraction that comes with those benefits.
we may want to use that here and there when appropriate

-   **=> "collection" abstraction not part of csuite, in case we need to batch migrate on the backend within a transaction**

    -   but part of monoloco IF we want them
    -   collection could just be a set of function to attempt migration
        on the backend side within a transaction and report either success or failure.
    -   "collection" will offer api to do batch migration if we want them

-   **support both unsafe instanciation or safe instanciation (via different APIs)**

    -   Safe access a well-constructed document that require the serial to be properly valid post-migration
        and crash otherwise
    -   Access a document with a given schema, always returning a valid document, by auto-filling missing fields
        with default values and returning all errors for fixing or error reporting

-   **a guaranteed-to-not-loose-data way to preserve data that is no-longer used by a document when instanciating foolowing a schema**

-   let's call them `leftover` data ?

    -   https://www.thesaurus.com/browse/leftover
    -   adjective: remaining left uneaten unconsumed excess surplus superfluous extra additional unused unwanted spare in reserve
    -   noun: residue survivor legacy vestige trace leavings uneaten food remainder unused supplies scraps remnants remains scourings
        slops crumbs dregs excess surplus overage rejects offcuts tail ends odds and ends bits and bobs oddments

-   container for `leftover` data at the document root ?

    -   probably stored at the root of the document, for later usage in a migration

-   a way to help with accessing those in a type-safe way

    -   via codegen when schema is no longer accessible
    -   via explicitly linking with previous schema version when it lays around somewhere.

-   a migration system that can be attached to any schema node,
    -   can mark `leftover` data as recovered

## concrètement

-   concrètement, y'a du taf.

values:

    - `defaultValue`
    - `valueWithNullWhenAcessingInvalidOrUnset` ?
    - `valueWithThrowWhenAccessingInvalidOrUnset` ?
    - `valueOrDefaultForTypeSomehow` ?
    - `valueOrDefaultForTypeSomehowSoValueIsValidForSchema` ?

```ts
type K = Partial<string>
```
