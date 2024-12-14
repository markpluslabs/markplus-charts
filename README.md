# MarkPlus Charts

MarkPlus Charts is a versatile library for generating charts in SVG format. It works seamlessly in both browser and server-side environments, without relying on the DOM or Canvas, making it lightweight and highly adaptable.

## [online demo](https://markpluslabs.github.io/markplus-charts/)

## Philosophy

This library aims to offer features comparable to [Mermaid](https://mermaid.js.org/) and [Chart.js](https://www.chartjs.org/), but without relying on the DOM or Canvas.

## Why?

While I appreciate the capabilities of Mermaid and Chart.js, their heavy dependencies make them less suitable for server-side or Node.js environments. This inspired me to create a lightweight alternative that operates independently of browser-specific technologies.

## Install

```
bun add markplus-charts
```

## Usage

```ts
import { generate } from 'markplus-charts';

const svgStr = generate('A -> B');
```

## Chart syntax

Refer to [docs](./docs.md)
