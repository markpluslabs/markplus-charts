## Global Settings

### Sample

### Direction

```
direction: right
```

**Default**: `right`

Sets the overall flowchart direction. Options include:

- `right`
- `down`
- `left`
- `up`

### Routing Style

```
routingStyle: orthogonal
```

**Default**: `orthogonal`

Defines the style for routing links between nodes. Options are:

- `orthogonal`
- `splines`
- `polyline`

### Spacing

```
spacing: 64
```

**Default**: `64`  
**Minimum**: `16`

This setting defines the space between adjacent nodes.

### Node Padding

```
nodePadding: 16 32
```

**Default**: `16 32`  
**Minimum**: `0`

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

---

## Node Settings

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

### Padding

```
A {
  padding: 16 32
}
```

**Default**: `16 32`  
**Minimum**: `0`

This setting overrides the global `nodePadding` for individual nodes. For details, see the [Global Node Padding](#node-padding) section.
