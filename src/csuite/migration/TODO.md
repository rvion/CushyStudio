some operations are synchronous

-   how can we hook some async behaviour in the middle
-   should we crash ?

some operation have well defined semantics

-   should we fail ?
-   should we revert silently to previously valid state
    (e.g. field.value must be < 6)
-   field.value = 4 // ok
-   field.value = 8 // fails silently ? revert value to 4 ? clamp to 6

-   what can the middleware promise do ?

-   intercept value ? cancel it ? prevent it ?

-   do we need a global middleware ? attached on document ?
-   something like spy ?
-   do we want many smaller controlle hooks

---

-   quid des race conditions

    -   encore pire, quid des gens qui ont des vérsions différentes du schema / de l'extension.

-   hash du schema intermédiare

---

proposition 2

-   écrire un test
    -   schema 1
    -   serial 1
    -   schema 2
    -   appliquer serial 1 à schema 2
        -   comprndre ou stoquer les erreurs
-   avoir une sorte de document Fixer

    -   foncitonne sur une collection
    -   propose des fix en batch à appliquer pour fixer les choses

-   construit à partir des erreurs de validation ?
-   extensible ?

---

💡💡💡 utiliser pro-activement ce document fixator en essayant d'instancier
tous les docs, et en montrant en arrière plan les PBs.

💡💡💡💡💡💡important d'optimiser pour broken-first, then recovery,
then use those tools to make it proactively fixing before saving 💡💡 (good idea here)

---

```ts
/*
// TODO:

ADD type `Anomaly` that record serial problem
   // prettier-ignore
   type FieldAnomaly =
      // common part
      ({ date: FL_Timestamp; atPath: string } &
         // variable part
         { type: 'dropped-serial'; schemaIs: BaseSchema; got: AnyFieldSerial })
         ⁉️ { type: 'validation-problem'; problem: Problem }
            => nope, validation should not go there.


BEHAVIOUR: Field.setOwnSerialWithValidationAndMigrationAndFixes
   => must always append every `anomaly` in the root field.
   If some instanciation operation is done and have to change a few serial
      removed serials must be added to the root document serial.anomalies
         - are unset fields anomalies ? prob not ?

   - only record cases where both are valid Serialish (with $:'...', but different value ?)

ADD: field.hoistAnomalies()
   traverse graph, hoist all problems, and re-path them to the root.
   done in a transaction
   mutate serial

ADD: field.dropAnomalies()
   drop all anomalies in
   not transitive (use field.hoistAnomalies)


ADD: backend endpoint that attempt to load a collection with the modified schema
   1. send serial of the schema meta-schema,
   2. instanciate it
   3. build final schema
   4. load whole collection with it
      - or just a sample ?
   5. collect all anomalies
   6. return them to front.

Add type `DocumentFix`
   that is a free structures containing lambda(field, anomaly) that mutate the field.
   those fix have a extra ui sub-document that can be configured to pick a behaviour.

add type `CollectionFix` that have an extra selector that filter the document/anomalies
   and apply the fix in batched transaction.

add endpoint that attempt in sql transaction to apply a whole collection Fix.

ADD a `Fixator2000` class that gather a bunch of doc anomalies and produces "CollectionFix" and "DocumentFix"
   1. make intermediary structure for testability
   2. offer fixes
   3. offer batch fixes for common fixes.

ADD async validation to
   - CLI when
   - some specific forms like the one to save

AND ADD a way to send the fixes alongside migrations when saving something that will lead to a schema change
   - like above(CLI+ meta-schema save)

Make sure we can gather anomalies in some asynchronous way;
   backend need to be able to report possible anomalies in ~2seconds if it needs
   to batch load every instance, instanciate them, and do some random stuff with them.


ADD somewhat stable schema.id that can be user configured.

-------------
other extra stff that could be usefull
show nice type diff for values to ease review

*/
```

---

key things I made sure the proposal will enable us to support in the long term:

-   Assume things are already broken, and that we can recover from that state
-   make it easy to preview impact of a schema change
    -   both in extension config: OK
    -   both in custom table / custom columns : OK
-   make it easy to display a graphical mini-form or button to apply fix on bunch of broken instances.
    -   both a priori
    -   AND a posterioi
-   use free structure so anomalies/fixes can be read and understood by humans both cli/web and
    interractive/non-interractive environments.
-   easy to extend the `fixator` to support new fixes/ graphical fixes after some migrations.
-   have generic fix where people write mini code inline to fix things

---

practical use-case :

out type/choice field to pick column type
=> generate a new incompatible schema.
=> add all simple cases number => tring, string => number, etc
=> fallback though string.
