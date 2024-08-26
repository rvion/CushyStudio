# **Presenters**

## concept:

`Presenters` is the core abstraction to define **model views**.

## Problem:

- We need to **render models in different ways in different places**.

- We need a way to completely **change how every field in a model tree is rendered**,
  **without having to change the field definition** (schema)

- We need to be able to **extend** a presenter inline in a component,
  to quickly tweak some field anywhere in the tree without having to recreate a full renderer

- we need to make it easy to **configure and override** how fields are rendered based
  - their `surrounding`
  - their `field type`
  - their `path in the model`

- we need presenter to be **codebase agnostic**. Anyone, in any codebase must be able to create
    a presenter, and use it to render a field using custom components, in a **type-safe way**.

- we need to be able to customize models as fast as possible during UX session with a designer.
  the overal api should be so smooth that mostly any form/field combination should be easy to
  express.

## Solution:

A presenter class, that is easilly extensible, and acts as a proxy to render field.
Presenters are injectec when rendering fields, and carried down the rendering tree.

## high-level technical design:

Presenters are class
    - that implements the `render(field: Field) => JSX` method

Every field in the tree that render child fields,
must call `context.currentPresenter.render(child)`

We can use presenters from fields with any custom presenter class

```ts
FIELD.render(PRESENTER)
// (👇) equivalent to
PRESENTER.render(FIELD)
```



```
// when you have a presenter instance, you can use it to render a field
// using it's render method
PRESENTER.render(field)
```

## Well-known presenters


csuite defined a few well-known presenters, that can be overriden if you want.

```ts
field.renderAsCell; /* => */ field.render(CellPresenter, {... /* Cell Presenter Props */})
field.renderAsForm; /* => */ field.render(FormPresenter, {... /* Form Presenter Props */})
```

Those showcase how to use custom Formatters that accept custom configuration props to
adapt to