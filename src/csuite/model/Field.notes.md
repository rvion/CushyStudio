# ⚖️ LAWS of Fields ⚖️

1.  Your custom `get value_or_fail(): K['$Value']`

    1. Must crash if the value is not set.
    2. Must NOT try to conjure any intented value.
    3. Must **NOT use default value**. default value should be assigned during `setOwnSerial`, only.

2.  Your custom `get value_or_zero(): K['$Value']`

    1. Should do its best to return a value,
    2. must conjuring some valid default value if possible 3. Must **NOT use default value**. default value should be assigned during `setOwnSerial`, only.
    3. must THROW if some `zero` value does not exists or is deemed too dangerous
    4. must NOT return null, unless the type allows you to

3.  Your custom `get value_unchecked(): K['$Unchecked']`

    1. must always return the advertized type (`Field['$Unchecked']`).
    2. must never crash

4.  Your custom `get value(K['$Value']): K['$Value']`:

    1.  is only required because mobx is prevening us to place it on base class
    2.  must just return :
        ```ts
        get value(): Field_bool_value {
            return this.value_or_fail
        }
        ```

5.  Your custom `set value(next: K['$Value']): void` setter:

    1. must abort early if the value is the same
    2. must **not** call `this.setOwnSerial` directly, but simply patch this.serial
    3. must run changes within `this.runInValueTransaction(() => { ... })`
    4. must not be paired with a getter (default implementation is `return this.value_or_fail` in base field)

6.  Your custom `protected setOwnSerial(next: Field_xxxx_serial): void`:
    setOwnSerial(next) is almost here to call `this.serial = next`
    with some extra stuff. it's almost a regular field action, execpt
    it's internal, and has a few extra responsibilities (like fixing external serials)
    so it's efficient and avoids producing intermediary serials.

    your `setOwnSerial` should in order

    -   1.  CANONICAL SERIAL FORM (tweak the input serial into it's canonical form)

        -   1.1 add various default values when they need to be persisted in serial uppon instanciation.
        -   1.2 add various missing expected properties
            (sometimes, they are marked optional, but it's convenient to add them early here)

    -   2.  ASSIGN SERIAL (yup, just call `this.assignNewSerial(next)`, or use the setter alias `this.serial = ...`)

    -   3.  RECONCILIATION (finally, reconcile the children)
            they may produce new versions, but that's OKAY.
            if you find a better way to assign the serial only once at the end only, let's discuss it !
            (But beware of dragons, it's easy to break the mental model during those intermediary steps )

    -   it must also obey those laws: it

        1. must be **idempotent**

        2. must **never** mutate the input serial object

            1. use `next = produce(next, (draft) => {...})` instead

        3. must assign the current `defaultValue` to the serial if the value is not set (default must be SET at init time)
           | postgres and other sql databases work like that
           | this is very important for data consistency

        4. must **not be manually called in your field**

            1. only called internally in `setSerial` and `init`

        5. should not handle children serial directly; must call `this.RECONCILE` for children data

            1. MUST ONLY CHANGE own-data, not data belonging to child
            2. `RECONCILE` will call `setSerial` on already instanciated children so other invariants remain true
            3. (there might be exceptions; currently one in `Field_list`)

7.  `get ownTypeSpecificProblems(): Problem_Ext`

    1. must NOT include children-specific problems
    2. must NOT include problems from the shared `check` function in the config
    3. only the least common ancestor can add ermerging problems from multiple children

8.  `readonly hasChanges: boolean`

    1. must return `false` when the value has not ben set

9.  `get isSet(): boolean`

    1. must return `false` if any subfield is not set
       | return true if the field has a value set

10. every serial/value modification function must go through

    1. `this.runInSerialTransaction(() => { ... })` if not modifying the value
    2. `this.runInValueTransaction(() => { ... })` if modifying the value
    3. except in `setOwnSerial`
        1. protected method,
        2. only called from `init` and `set_serial`

11. your field should NOT handle nullability itself

    -   it's better to go through a `Field_optional<YourField>`
    -   often, most of the methods will be polluted and include two different code paths
    -   you'll often end-up with instances with unknown generic parameters
    -   you won't be able to properly type return types
    -   you may end duplicating your code in every field
    -   etc.

        🔶 it is generally a bad idea to support nullability in the field itself.
        as a rule-of-thumbs, reifying a nullability mode as a generic parameter is probably a bad idea.

12. if you decided that your field should handle nullability itself anyway:

    1. you must override `get canBeSetOnOrOff(): boolean`
    2. you must override `setOn(): void`
    3. you must override `setOff(): void`

13. 🔶 (TEMPORARY; will be removed asasp) DefaultHeaderUI
14. 🔶 (TEMPORARY; will be removed asasp) DefaultBodyUI

---

CSuite-Model-Framework (`CMF`) is a batteries included state management library that offers:

-   Centralized stores for your data
-   powerful, composable, and flexible API for defining your data structures
-   Mutable API, protected data, and immutable storage: it is easy to work with your data, but safe to modify.
-   Serializable and traceable updates. The mutable, protected nature of `CMF` data means you can generate snapshots and do time-travel debugging.
-   Transactional updates, with rollback capabilities.
-   First-class react integration
-   Side effect management, so you don't need to write useEffect hooks or their equivalent to manage the consequences of data mutations. You can do it all from `CMF` itself.
-   clean separation and APIs for your data-layer -> business-layer -> UI-layer
-   Runtime type checking, so you can't accidentally assign the wrong data type to a property
-   Static type checking with TypeScript inference from your runtime types - automatically!
-   Data normalization - `CMF` has support for references, so you can normalize data across your application code.
-   and more (soon)
    -   Code-generation utilties
    -   ...

As a state container, `CMF` combines the simplicity and ease of mutable data with the traceability of immutable data and the reactiveness and performance of observable data.

Simply put, `CMF` combine the best features of both immutability (`transactionality`, `traceability` and `composition`) and mutability (`discoverability`, `co-location` and `encapsulation`) based approaches to state management;

by beeing very opinionated about how data should be structured and updated, `CMF` solve many common problems out of the box.

Central in `CMF` is the concept of a living tree. The tree consists of mutable, but strictly protected objects enriched with runtime type information and custom methods. In other words, each tree has a shape (type information) and state (data). From this living tree, immutable, structurally shared, snapshots are automatically generated.

---

lib name not quite decided yet;

alt names:

-   CLUMF: Cushy-and-Locomotive-Unified-Modeling-Framework
-   MAGA: Model-And-Graph-Abstraction
-   CUSHY: Cushy-Universal-State-Handling-Yard
