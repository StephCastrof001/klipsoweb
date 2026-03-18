# Oryzo-1

Open weight 3D coaster model in OBJ format for rendering, simulation, and gloriously unnecessary research.

[![Video](thumb.png)](https://www.youtube.com/watch?v=uGJ9qh7DO-0)
Intro: [Youtube](https://www.youtube.com/watch?v=uGJ9qh7DO-0) | Website: [oryzo.ai](https://oryzo.ai)

## Abstract

We present Oryzo-1, an open weight 3D model of a cork coaster for rendering, simulation, and gloriously unnecessary research. Oryzo-1 faithfully reproduces key coaster behaviors, including table protection, perfect circularity, and passive thermal moderation under everyday beverage conditions.

This repository contains the initial public release of the Oryzo-1 checkpoint family in clean OBJ format:

- `checkpoints/oryzo-1-26b-a0b.obj`
- `checkpoints/oryzo-1-40b-a0b.obj`
- `checkpoints/oryzo-1-108b-a0b.obj`
- `checkpoints/oryzo-1-145b-a0b.obj`
- `checkpoints/oryzo-1-168b-instruct-a0b.obj`
- `checkpoints/oryzo-1-344b-a0b.obj`

Baseline results were obtained on WoodenBench, a standardized evaluation suite conducted on a single desk and very possibly rigged by us. Limitations include heavy dependency on gravity, mugs, and human deployment.

## Checkpoints

| Model | Type |
|---|---|
| `oryzo-1-26b-a0b.obj` | Base |
| `oryzo-1-40b-a0b.obj` | Base |
| `oryzo-1-108b-a0b.obj` | Base |
| `oryzo-1-145b-a0b.obj` | Base |
| `oryzo-1-168b-instruct-a0b.obj` | Instruct |
| `oryzo-1-344b-a0b.obj` | Frontier |

## Acknowledgements

This repository was single shot espresso'd into existence by the creative team at Lusion.

## Peer Review

> "Oryzo-1 A0B is the best model out there. Trust me bro." - Anonymous LocalLLaMA Reddit user

## Citation

If you find Oryzo-1 useful in your research, please cite:

```bibtex
@misc{oryzo2026,
  title        = {Oryzo-1: Open-Weight Coaster Model},
  author       = {Lusion},
  year         = {2026},
  howpublished = {OBJ release},
  note         = {A high-fidelity 3D model of a cork coaster. Code: coming soon.
}
```

## License

MIT
