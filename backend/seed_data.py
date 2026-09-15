from datetime import datetime, timezone

NOW = datetime.now(timezone.utc).isoformat()


def P(name, price=None, description=None, image=None):
    return {"name": name, "price": price, "description": description, "image": image, "hidden": False}


def C(id, name, short, group, products, time=None, sharedPrice=None):
    return {
        "id": id,
        "name": name,
        "short": short,
        "time": time,
        "sharedPrice": sharedPrice,
        "group": group,
        "hidden": False,
        "products": [P(*p) if isinstance(p, tuple) else P(p) for p in products],
    }


DEFAULT_THEME = {
    "title": "BUFFET",
    "subtitle": "MAR Y TIERRA",
    "primaryColor": "#1a58b0",
    "secondaryColor": "#c1440e",
    "backgroundColor": "#fffdf9",
    "heroImage": None,
    "backgroundImage": None,
    "banner": None,
    "decorativeImage": None,
}

SEPT15_THEME = {
    "title": "BUFFET 15 DE SEPTIEMBRE",
    "subtitle": "MAR Y TIERRA · EDICIÓN ESPECIAL",
    "primaryColor": "#146b3a",
    "secondaryColor": "#b02a37",
    "backgroundColor": "#faf5ea",
    "heroImage": None,
    "backgroundImage": None,
    "banner": None,
    "decorativeImage": None,
}

TRADITIONAL_CATEGORIES = [
    C("barra-fria", "BARRA FRIA", "Barra Fría", "cocina", [
        "CEVICHE DE PESCADO", "AGUA CHILE VERDE", "AGUA CHILE NEGRO", "AGUA CHILE ROJO",
        "TOSTADA DE CALAMAR", "TOSTADA DE CEVICHE", "OSTION EN CONCHA", "OSTION RASURADO",
        "COCTEL DE CAMARON", "COCTEL CAMPECHANO",
    ], time="3-5 MIN"),
    C("entradas", "ENTRADAS", "Entradas", "cocina", [
        "PESCADILLAS", "EMPANADAS CAMARON", "CALDO DE CAMARON", "FILETE REBOZADO", "EMPANADAS CALAMAR",
    ], time="5-10 MIN"),
    C("mojarras", "MOJARRAS", "Mojarras", "cocina", [
        "MOJARRA FRITA", "MOJARRA AL MOJO DE AJO", "MOJARRA AL AJILLO", "MOJARRA A LA TALLA",
        "MOJARRA A LA VERACRUZANA", "MOJARRA A LA DIABLA",
    ], time="20-25 MIN"),
    C("snacks", "SNACKS", "Snacks", "cocina", [
        "TOTOPOS CON GUACAMOLE", "NACHOS CON QUESO Y ARRACHERA", "PAPAS A LA FRANCESA", "NUGUETS",
    ], time="20-25 MIN"),
    C("platillos-especiales", "PLATILLOS ESPECIALES", "Especiales", "cocina", [
        "ALAMBRE DE ARRACHERA", "ALAMBRE DE CAMARON", "CROQUETAS DE SURIMI",
        "CROQUETAS DE PESCADO", "CAMARONES TAMARINDO", "HAMBURGUESA DE CAMARON",
    ], time="20-25 MIN"),
    C("arroz-y-pasta", "ARROZ Y PASTA", "Arroz y Pasta", "cocina", [
        "SPAGUETTI BLANCO CON CAMARONES", "SPAGUETTI DE CHIPOTLE CON CAMARONES", "ARROZ BLANCO", "ARROZ MARINERO",
    ], time="3-5 MIN"),
    C("complementos", "COMPLEMENTOS", "Complementos", "cocina", [
        "TACO GOBERNADOR", "TACO DE CALAMAR", "TACO DE CHORIZO ARGENTINO", "TACO DE ARRACHERA",
        "TACO DE CAMARON REBOZADO", "HAMBURGUESA DE RES", "HAMBURGUESA DE POLLO", "HAMBURGUESA DE ARRACHERA",
    ], time="10-15 MIN"),
    C("camarones", "CAMARONES", "Camarones", "cocina", [
        "CAMARON AL MOJO DE AJO", "CAMARON AL AJILLO", "CAMARON A LA DIABLA", "CAMARONES AL COCO",
        "CAMARONES EMPANIZADOS", "BROCHETA DE CAMARONES", "ALAMBRE DE CAMARON",
    ], time="30-35 MIN"),
    C("filetes", "FILETES", "Filetes", "cocina", [
        "FILETE EMPANIZADO", "FILETE A LA PLANCHA", "FILETE ESPECIAL",
        "FILETE RELLENO (CAMARON, SURIMI, CALAMAR Y OSTION)",
    ], time="20-25 MIN"),
    C("para-compartir", "PARA COMPARTIR", "Compartir", "cocina", [
        "BURRITO MAR Y TIERRA", "MOLCAJETE MAR Y TIERRA", "BURRITO TIERRA",
    ], time="20-25 MIN"),
    C("cortes-en-espada", "CORTES EN ESPADA", "Cortes", "cocina", [
        "PICANHA", "CHICHARRON DE REB EYE", "SIRLOIN ENCHILADO", "CHURRASCO", "CHISTORRA",
        "CALABREZA", "CHORIZO BRASILEÑO", "ARRACHERA", "VACIO DE RES", "PAN DE AJO",
        "PIÑA CON CANELA", "ALITAS",
    ], time="10-15 MIN"),
    C("postres", "POSTRES", "Postres", "dulce", [
        ("HOJALDRE CON FRUTOS ROJOS", "$139"), ("HOJALDRE CON FRESAS", "$139"),
        ("TRES LECHES", "$169"), ("CONEJITO", "$189"), ("FESAS JUBILEE", "$249"),
        ("MANZANAS AL BAILEY´S", "$249"), ("CREPAS FLAMBEADAS (4 PZ)", "$259"),
    ]),
    C("helados-de-fruta", "HELADOS DE FRUTA", "Helados", "dulce", [
        "PIÑA", "ELOTE", "COCO", "MAMEY", "TRUFA",
    ], sharedPrice="$149"),
]

SEPT15_CATEGORIES = [
    C("entrada", "ENTRADA", "Entrada", "cocina", [
        "CALDO DE CAMARON", "AGUACHILES", "TOSTADAS ALETA AMARILLA",
    ]),
    C("segundo-tiempo", "SEGUNDO TIEMPO", "Segundo tiempo", "cocina", [
        "POZOLE (CARNE DE PUERCO O POLLO)", "TOSTADAS DE TINGA", "CHILAQUILES", "SOPESITOS",
    ]),
    C("tercer-tiempo", "TERCER TIEMPO", "Tercer tiempo", "cocina", [
        "ESPADAS",
    ]),
    C("guarniciones", "GUARNICIONES", "Guarniciones", "cocina", [
        "ARROZ ROJO", "CEBOLLAS CAMBRAY", "CHILES TOREADOS",
    ]),
]

DRINK_CATEGORIES = [
    C("bebidas", "BEBIDAS", "Bebidas", "bebidas", [
        ("REFRESCOS", "$59"), ("AGUA EMBOTELLADA", "$49"), ("JUGO 355 ML", "$49"),
        ("AGUA MINERAL", "$49"), ("SANGRIA PREPARADA", "$79"), ("CLAMATO PREPARADO", "$79"),
        ("SUERO", "$65"), ("LIMONADA MINERAL", "$59"), ("NARANJADA MINERAL", "$59"),
    ]),
    C("cocteleria", "COCTELERIA", "Coctelería", "bebidas", [
        ("PIÑADA", "$89"), ("CONGA", "$89"), ("SHIRLEY TEMPLE", "$89"), ("SAN FRANCISCO", "$89"),
        ("LIMONADA DE FRAMBUESAS", "$99"), ("TE FRIO DE HIERBABUENA", "$59"),
        ("LIMONADA ELECTRONICA", "$79"), ("ANDARIEGAS DE SABORES", "$99"), ("FAKE MOJITO", "$89"),
    ]),
    C("andariegas-cebadas", "ANDARIEGAS CEBADAS", "Cebadas", "bebidas", [
        ("MICHELADA DE TAMARINDO", "$159"), ("MICHELADA DE KIWI", "$159"),
        ("MICHELADA MANGO FRESA", "$159"), ("MICHELADA MORAS AZULES", "$159"),
        ("MICHELADA KIWI SANDIA", "$159"), ("MICHELADA TROPICAL", "$169"),
        ("MICHELADA ANDARIEGA", "$189"), ("MICHELADA CUBANA", "$159"),
        ("MICHELADA E-YAKULADA", "$175"),
    ]),
    C("cerveza", "CERVEZA", "Cerveza", "bebidas", [
        ("PACIFICO", "$76"), ("NEGRA MODELO", "$89"), ("MODELO ESPECIAL", "$89"),
        ("CORONA", "$69"), ("VICTORIA", "$69"), ("ULTRA", "$89"),
        ("MICHELADA 1 LT", "$169"), ("ANDARIEGA DE CAMARON 960 ML", "$249"),
    ]),
    C("servicios", "SERVICIOS", "Servicios", "bebidas", [
        ("MICHELADO", "$25"), ("CUBANO", "$25"), ("CLAMATO PARA CERVEZA", "$35"),
    ]),
    C("cafe", "CAFE", "Café", "dulce", [
        ("AMERICANO", "$49"), ("CAPPUCCINO", "$69"), ("ESPRESSO", "$49"), ("FRAPPUCCINO", "$79"),
    ]),
]

TRADITIONAL_BUFFET = {
    "_id": "buffet-tradicional",
    "name": "Buffet Tradicional",
    "active": True,
    "categories": TRADITIONAL_CATEGORIES,
    "theme": DEFAULT_THEME,
    "validFrom": None,
    "validTo": None,
    "branch": None,
    "createdAt": NOW,
    "updatedAt": NOW,
}

SEPT15_BUFFET = {
    "_id": "buffet-15-septiembre",
    "name": "Buffet 15 de Septiembre",
    "active": False,
    "categories": SEPT15_CATEGORIES,
    "theme": SEPT15_THEME,
    "validFrom": None,
    "validTo": None,
    "branch": None,
    "createdAt": NOW,
    "updatedAt": NOW,
}

DRINKS_CATALOG = {
    "_id": "global",
    "categories": DRINK_CATEGORIES,
    "updatedAt": NOW,
}
