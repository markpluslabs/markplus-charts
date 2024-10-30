## Global Settings

### sample

### direction

```
direction: right;
```

Default value is "right".

The flowchart direction:

- right
- down
- left
- up

### routingStyle

```
routingStyle: orthogonal;
```

Dedault value is "orthogonal".

Link routing styles:

- orthogonal
- splines
- polyline

### spacing

```
spacing: 64;
```

Default value is 64. Minimum value is 16.

It is the distance between two adjacent nodes.

### nodePadding

```
nodePadding: 16 32;
```

Default value is "16 32". Minimum value is "0".

The distance from node sides to text in nodes. It can affect the size of nodes.
If the value is small, the node may not be big enough to hold its text.

If you specify only one number, this number will be used for both vertical and horizontal padding.

You may specify two numbers, the first number will be used for vertical padding and the second number will be used as horizontal padding.

## Node Settings

### shape

```
A {
  shape: rect
}
```

Default value is "rect".

- rect
- circle
- ellipse
- diamond
