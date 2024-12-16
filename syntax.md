# MarkPlus Charts Syntax

## Conventions for this document

All sample values in this document represent default values unless explicitly stated as overrides.

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

---

## Node Settings

First of all, here are all the settings that applies to nodes to override global settings:

- `padding` overrrides global `nodePadding`
- `borderWidth` overrides global `borderWidth`

### Shape

```
A {
  shape: rect
}
```

**Default**: `rect`

Defines the node shape. Options are:

- `rect`
- `circle`
- `ellipse`
- `diamond`

---

## Link Settings

First of all, here are all the settings that applies to nodes to override global settings:

- `style` overrrides global `linkStyle`
