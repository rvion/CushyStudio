---
description: >-
  The following is a set of style guidelines we would like all contributors to
  adhere to.
---

# Guidelines

***

For simplicity's sake we try our best to adhere to [Google's ](https://developers.google.com/style)developer documentation style guidelines. They are merely guidelines and not strict rules. Feel free to break free from the guidelines when it makes sense. (Even Google suggests this themselves.)

Below we have included any important notes in regards to creating our documentation. You are welcome to ask for advice in our [Discord](https://discord.gg/BaenNsG2zD) if you are unclear about anything.

## Images:

{% hint style="success" %}
* Images must use unique file names, or they will break conflicting images upon upload. _(This is a quirk with gitbooks.)_
*
{% endhint %}

{% hint style="warning" %}
* Use image compression if possible to reduce the filesize of images,
{% endhint %}

{% hint style="danger" %}

{% endhint %}

***

## Text Formatting:

{% hint style="success" %}
*
{% endhint %}

{% hint style="danger" %}
*
{% endhint %}

### Base style guide

We loosely follow the Google Developer documentation styling guidelines,

🚧 copy paste the key bullet points

🚧 add link to their guide

### Enhance pages with LLM.

* if possible, use this prompt: 🚧

```
....
keep it as concise as possible....
be explicit...
```



## Page description guidelines:

* gitbook allow to enter a short pure-text (no bold, ...) page description on each page.
* If possible, add one, but keep it very short.
* be descriptive about what this page is about.

## Naming: prefer one word

* ❌ Cushy SDK, Cushy Apps, Cushy Studio
* 🟢 CushySDK, CushyApps,  CushyStudio

## Page intros

* every page should start with a few oneliners paragraphs about&#x20;
  * one sentence to define stuff&#x20;
  * one sentence per other page that is closely related
    * great way to block things

## Nesting

* level0 top level group index-pages&#x20;
  * should never have unique content. only summary.&#x20;
  * Should have one link to every sub page + at most one or two paragraph (possibly 0)
* level1 page should have one single main topic
  * if a feature have 3 main subfeatures, we add  4 pages. all at the same level, because users will look for any of the 3 main subfeatures as much as the main feature. that also help&#x20;
  *   2 options

      * Only the main feature have the big documentaion, and other pages have one paragrah, one picture, and then point to main page

