# @crediblemark/build-ai

Asisten AI pendamping visual editor **CredBuild** untuk membuat halaman web dan menyunting komponen menggunakan perintah teks natural language.

## 🚀 Fitur Utama

- **Zero-Config Prompt Generator**: Mengonversi konfigurasi komponen visual builder secara dinamis menjadi instruksi skema JSON untuk Gemini LLM.
- **Client & Server Separation**: Ekspor terpisah (Client vs Server) memastikan dependensi backend (seperti SDK Gemini) tidak bocor ke browser bundle.
- **AI Drop-in Button & Panel**: Menyediakan tombol `AIButton` mengambang dengan panel asisten chat siap pakai.
- **React State Hooks**: Menyediakan hook `useCredBuildAI` kustom bagi developer yang ingin membuat UI panel AI mereka sendiri.

---

## 📦 Instalasi

Tambahkan paket lokal atau npm:

```bash
bun add @crediblemark/build-ai
```

---

## 🔧 Cara Penggunaan

### 1. Integrasi Frontend (Client)

Impor dan pasang komponen `<AIButton />` di dalam komponen editor Anda:

```tsx
import { useState } from "react";
import { CredBuild } from "@crediblemark/build";
import { AIButton } from "@crediblemark/build-ai";
import config from "./credbuild.config";

export function Editor({ initialData }) {
  const [data, setData] = useState(initialData);

  return (
    <div className="relative w-full h-screen">
      <CredBuild config={config} data={data} onChange={setData} />
      
      {/* Cukup drop tombol AI ini di dalam container relative */}
      <AIButton data={data} onChange={setData} assistantUrl="/api/ai" />
    </div>
  );
}
```

### 2. Integrasi Backend (Server / Next.js API Route)

Buat handler Next.js API Route pada file `app/api/ai/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { generatePageWithAI, generateSectionWithAI } from "@crediblemark/build-ai/server";
import { buildUiPreset } from "@crediblemark/build-ui";

export async function POST(req: Request) {
  const { prompt, mode } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;

  if (mode === "page") {
    // Menghasilkan satu halaman utuh
    const pageData = await generatePageWithAI(prompt, buildUiPreset, { apiKey });
    return NextResponse.json(pageData);
  } else {
    // Menghasilkan satu blok komponen baru saja
    const sectionData = await generateSectionWithAI(prompt, buildUiPreset, { apiKey });
    return NextResponse.json(sectionData);
  }
}
```

---

## 🛠️ API Reference

### Client Exports

- `<AIButton data={data} onChange={onChange} assistantUrl={url} />`: Tombol terapung AI.
- `useCredBuildAI({ data, onChange, assistantUrl })`: React Hook kustom untuk sinkronisasi state AI.

### Server Exports (`@crediblemark/build-ai/server`)

- `generatePageWithAI(prompt, config, { apiKey, modelName })`: Menghasilkan layout halaman penuh (JSON).
- `generateSectionWithAI(prompt, config, { apiKey, modelName })`: Menghasilkan satu komponen blok (JSON).
- `generateSystemInstruction(config)`: Helper untuk menghasilkan system instruction string berisi skema komponen editor untuk LLM.
