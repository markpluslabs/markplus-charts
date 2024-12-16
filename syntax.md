# MarkPlus Charts Syntax

## Conventions for this document

All sample values in this document represent default values unless explicitly stated as overrides.

You don't need to explicitly specify the settings if you are OK with the default values.

## Global Settings

### direction

```
direction: right
```

Sets the overall flowchart direction.
Options are:

- `right`
- `down`
- `left`
- `up`

### routingStyle

```
routingStyle: orthogonal
```

Defines the style for routing links between nodes.
Options are:

- `orthogonal`
- `splines`
- `polyline`

### spacing

```
spacing: 64
```

**Minimum**: `16`

Defines the space between adjacent nodes.

### nodePadding

```
nodePadding: 32
```

Sets global padding for all nodes, controlling the space between text inside a node and its edges. This padding may affect the overall node size.

You can override this setting for individual nodes:

```
A {
  padding: 24 // overrides the default
}
```

**Note:** Padding assumes a rectangular node shape. For non-rectangular shapes, they are fully contained within this rectangle. If padding is too small for non-rectangular shapes, text may not fit properly.

Padding values can be set as:

- A single number for uniform vertical and horizontal padding.
- Two numbers where the first applies to vertical padding, and the second to horizontal padding.

### linkStyle

```
linkStyle: solid
```

Defines the link style.
Options are:

- `solid`
- `dashed`
- `dotted`

This value could be overriden per link:

```
A ->{style: dotted} B
```

### borderWidth

```
borderWidth: 2
```

Sets the border width for all nodes.

This value could be overriden per node:

```
A {
  borderWidth: 8
}
```

### nodeShape

```
nodeShape: rect
```

Default shape for all nodes.

Options are:

- `rect`
- `circle`
- `ellipse`
- `diamond`

This value could be overriden per node:

```
A {
  shape: circle
}
```

### arrowHeads

```
arrowHeads: end
```

Where to show an arrow head on links. By default it will show at the `end` of the link.
Set it to `none` to disable arrow heads. Set it to `both` to show arrow heads at both ends.

Options ares:

- `end`
- `none`
- `both`

This value could be overriden per link:

```
A ->{ arrowHeads: both } B
```

### rectRadius

```
rectRadius: 0
```

This option can be specified when the node shape is `rect`.
It will make the rectangle to have round corners if you specify a value greater than 0.

This value could be overriden per node:

```
A { rectRadius: 8 }
```

---

## Node Settings

Here are all the settings that applies to nodes to override global settings:

- `padding` overrrides global `nodePadding`
- `borderWidth` overrides global `borderWidth`
- `shape` overrides global `nodeShape`

### Label

```
A { label: User A }
```

Label of the node. If not specified, the node ID (`A` in the sample about) will be used as label.
Label will show in the center of the node.

---

## Link Settings

Here are all the settings that applies to nodes to override global settings:

- `style` overrrides global `linkStyle`
- `arrowHeads`overrides global `arrowHeads`

### label

```
A ->{label: ❤️} B
```

Show a label on the link.
It is optional.

---

## Comments

Anything followed by `//` are considerd as comments:

```
// global settings
direction: down // other options are up, left and right
routingStyle: splines
```

Code above is equivalent to:

```
direction: down
routingStyle: splines
```

If label text contains `//`, you will need to escape it:

```
A { label: http:\//www.example.com}
```
