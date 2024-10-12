❌ no longer true

# **Renderers**

## concept:

`Renderers` is the core abstraction to define **document views** and forms.

## Problem:

- We need to **render document in different ways in different places**
  -  sometimes all document fields.
  -  sometimes some fields only
  -  various layout, various field order, etc.

- Schema and View should live in different places:
  - We need a way to completely **change how every field in a model tree is rendered**,
  **without having to change the field definition** (schema)


- we need to make it easy to **configure and override** how fields are rendered based
  - their `surrounding`
  - their `field type`
  - their `path in the model`
  in the most concise way;
  in other words:
    👉 we need to be able to customize views as fast as possible during UX session with a designer. the overal api should be so smooth that mostly any form/field combination should be easy to express.
    👉 we must be able to quickly tweak some field anywhere in the tree without having to re-specify the whole form UI.

    👉👉👉 MOST IMPORTANT POINT
    THE API MUST FOLLOW LANGUAGE DESIGN (DSL) PRINCIPLES:
      - match how UX/UI people speak
      - need to have concise API for every UX tweak they might request.

- we need `renderer` to be **codebase agnostic**. Anyone, in any codebase must be able to create/extend a `renderer`, and use it to render a document using custom components, in a **type-safe way**.


## Solution:

A `renderer` class that is able to compute for every field in a document
the Wrapper Component and it's params/slot from various.

The obligation to go though the `renderer` to render fields: every field with children must
go though `renderCtx.`renderer`.present(child)`.

An exhaustive list of slots that can be tweaked/overriden easilly: one slot per word UI/UX people might use when helping us to make form better.

A powerfull, flexible and composable rule system that allow to quickly tweak look and feel in any arbitrary part of the document tree.