from app import _find_banned_match

samples = {
    'clean': 'This is a nice diary entry about sunshine.',
    'rafi': 'Today I met Rafi at the park.',
    'kontol': 'Dia bilang kontool tapi tidak sopan.',
    'goblok': 'Jangan goblok lah.'
}

for name, text in samples.items():
    match = _find_banned_match(text)
    print(name, '=>', match)