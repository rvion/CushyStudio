# Migrating to new SDK


globally search and replace

```
X.XEnum<Enum_([A-Za-z0-9]+)_([a-zA-Z0-9_]+)>
```
by
```
X.XEnum<Comfy.Enums['$1.$2']>
X.XEnum<Comfy.Enums['$1.input.$2']>
```

-----------


<!-- ui.enum.Enum_LatentUpscale_crop -->
<!-- "Comfy.Base.LatentUpscale.crop" -->
```
.enum.Enum_([A-Za-z0-9]+)_([A-Za-z0-9_]+)\(
.enum["$1.input.$2"]

```


```
: _([A-Z]+)([,\s\n])
: Comfy.Input.$1$2
```


```
: Enum_([A-Za-z0-9]+)_([A-Za-z0-9_]+)
: Comfy.Enums['$1.input.$2']
```