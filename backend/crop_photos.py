from PIL import Image
import os

IMG = "/app/frontend/public/images"

def crop_frac(src, box_frac, out, size=640):
    im = Image.open(os.path.join(IMG, src)).convert("RGB")
    w, h = im.size
    l, t, r, b = box_frac
    im = im.crop((int(l * w), int(t * h), int(r * w), int(b * h)))
    im.thumbnail((size, size), Image.LANCZOS)
    im.save(os.path.join(IMG, out), "JPEG", quality=82, optimize=True)
    print(out, im.size)

crop_frac("menu-cafe-postres.jpeg", (0.10, 0.16, 0.48, 0.40), "foto-cafe.jpg")
crop_frac("menu-cafe-postres.jpeg", (0.04, 0.54, 0.48, 0.78), "foto-postre.jpg")
crop_frac("menu-bebidas.jpeg", (0.18, 0.70, 0.42, 0.90), "foto-michelada.jpg")
crop_frac("menu-bebidas.jpeg", (0.68, 0.78, 0.88, 0.96), "foto-cerveza.jpg")

for name in ["foto-camarones.png", "foto-pescado.png"]:
    im = Image.open(os.path.join(IMG, name)).convert("RGB")
    im.thumbnail((640, 640), Image.LANCZOS)
    im.save(os.path.join(IMG, name.replace(".png", ".jpg")), "JPEG", quality=82, optimize=True)
    os.remove(os.path.join(IMG, name))
    print(name, "->jpg", im.size)
