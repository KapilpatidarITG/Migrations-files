import re

# List of strings to search
data = [
    "Protec Freeride Helmet L",
    "Protec Freecarve Helmet L",
    "USD Youth Snorkelling Set S",
    "Protec Freecarve Helmet Sm",
    "Protec Freecarve Helmet XL",
    "HH SuntoryXL Jacket XL",
    "Protec Freeride Helmet M",
    "Prolimit Team Wave Harness M",
    "Prolimit Team Wave Harness L",
    "Prolimit TeaM Wave Harness XL",
    "HH Embargo Pant Black L",
    "HH Embargo Pant Steel S",
    "HH Embargo Pant Black M",
    "HH Echo Jacket Charc XL",
    "Section Dark Brown M",
    "Section WindBraker S"
]

pattern = r"\[(M|XL|S|L)\]" 

matches = []
for item in data:
    match = re.findall(pattern, item)
    if match:
        matches.append(match)

# Print the result
print(matches)