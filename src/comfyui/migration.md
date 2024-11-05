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
```
.enum.Enum_([A-Za-z0-9]+)_([A-Za-z0-9_]+)\(
```
by
<!-- "Comfy.Base.LatentUpscale.input.crop" -->
```
.enum["$1.input.$2"]

```