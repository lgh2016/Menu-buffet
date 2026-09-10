import asyncio
import base64
import os
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()

OUT = "/app/frontend/public/images"
os.makedirs(OUT, exist_ok=True)

STYLE = (
    "Fotografia realista de restaurante mexicano de mariscos y cortes, luz natural calida, "
    "mesa de madera rustica, plato blanco, presentacion casera y apetitosa, sin texto, "
    "sin marcas de agua, estilo fotografia editorial de comida, alta nitidez."
)

SHOTS = [
    ("foto-camarones.png", "Plato de camarones al mojo de ajo con arroz blanco y rebanadas de limon, camarones grandes dorados con ajo. " + STYLE),
    ("foto-pescado.png", "Mojarra frita entera dorada y crujiente servida con ensalada fresca, limones y arroz. " + STYLE),
    ("foto-corte.png", "Corte de carne asada tipo picana jugosa en espada de acero sobre brasas, humo ligero, asado brasileño. " + STYLE),
    ("foto-michelada.png", "Michelada mexicana en tarro escarchado con chile en polvo, limon, cerveza clara con hielo, gotas de condensacion. " + STYLE),
    ("foto-cafe.png", "Taza de cafe americano humeante vista desde arriba sobre plato blanco, mesa clara. " + STYLE),
    ("foto-postre.png", "Crepas flambeadas con cajeta y helado, postre mexicano elegante, decorado con menta y frutos rojos. " + STYLE),
]


async def gen_one(name, prompt, session_id):
    api_key = os.getenv("EMERGENT_LLM_KEY")
    chat = LlmChat(api_key=api_key, session_id=session_id, system_message="Genera imagenes realistas de comida.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    msg = UserMessage(text=prompt)
    text, images = await chat.send_message_multimodal_response(msg)
    if images:
        data = base64.b64decode(images[0]["data"])
        path = os.path.join(OUT, name)
        with open(path, "wb") as f:
            f.write(data)
        print(f"OK {name} ({len(data)} bytes)", flush=True)
    else:
        print(f"FAIL {name}: sin imagen", flush=True)


async def main():
    for i, (name, prompt) in enumerate(SHOTS):
        try:
            await gen_one(name, prompt, f"menu-foto-{i}")
        except Exception as e:
            print(f"ERROR {name}: {e}", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
