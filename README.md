# Samples — Hierarchical VQ-VAE Piano Generation

Site com exemplos de áudio gerados pela implementação do repositório
[hierarchical-vqvae-piano-generation](https://github.com/IvonLuiz/hierarchical-vqvae-piano-generation),
trabalho de conclusão de curso (TCC) sobre geração musical de piano usando
VQ-VAE hierárquica e espectrogramas Mel.

O texto completo do TCC está em
[TCC-latex](https://github.com/IvonLuiz/TCC-latex).

## Rodando localmente

Usar node 22:

```
npm install
npm run dev
```

## Adicionando áudios

Edite `src/data.json` e adicione a seção/modelo desejado. O campo `path` é
relativo a `public/audios`; os arquivos de áudio dentro dessa pasta são
descobertos automaticamente (sem precisar listar nome por nome).

## Deploy

Deploy automático para a Vercel a partir da branch `main`. Se for mudar algo
com ajuda de IA, crie outra branch e dê push pra `main` depois.
