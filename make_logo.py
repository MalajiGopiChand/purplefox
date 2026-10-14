import base64
from PIL import Image
import numpy as np
import os

# Load original
orig = Image.open(r'C:\Users\Gopi\.gemini\antigravity\brain\521a8896-3e0a-4314-982d-168e214b648f\.user_uploaded\media_1792004479926.png').convert('RGBA')

# Crop to circle center=(370, 370), r=335
cx, cy, r_crop = 370, 370, 335
cropped = orig.crop((cx - r_crop, cy - r_crop, cx + r_crop, cy + r_crop))
arr = np.array(cropped, dtype=float)

# Background color in the card
bg = np.array([220, 207, 200], dtype=float)

y, x = np.indices(arr.shape[:2])

# Green leaf detection
r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
is_green_leaf = (g > r + 15) & (g > b + 5)

# Clean out the top-left corner
outside_top = (40*x + 39*y < 10000) & (y < 130)
outside_edge = (y >= 130) & (y < 165) & (x < 100) & (~is_green_leaf)
outside_all = outside_top | outside_edge

# --- 1. Transparent Version ---
arr_trans = arr.copy()
arr_trans[outside_all, :3] = bg

color_dist = np.linalg.norm(arr_trans[:,:,:3] - bg, axis=2)
alpha = np.clip((color_dist - 20) / (45 - 20), 0, 1) * 255
alpha[outside_all] = 0

# Circle bounds
center = r_crop
circle_dist = np.sqrt((x - center)**2 + (y - center)**2)
alpha[circle_dist > (r_crop - 3)] = 0
arr_trans[:,:,3] = alpha

logo_trans = Image.fromarray(np.clip(arr_trans, 0, 255).astype(np.uint8))
os.makedirs('dist/images', exist_ok=True)
logo_trans.save('dist/images/logo.png', 'PNG')
logo_trans.save('dist/images/logo.webp', 'WEBP', quality=95)

# Favicon 192x192
favicon_192 = logo_trans.resize((192, 192), Image.Resampling.LANCZOS)
favicon_192.save('dist/favicon.png', 'PNG')

# Favicon SVG embedding the base64 PNG
with open('dist/favicon.png', 'rb') as f:
    b64_fav = base64.b64encode(f.read()).decode('ascii')
svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><image href="data:image/png;base64,{b64_fav}" width="192" height="192"/></svg>'
with open('dist/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

# --- 2. Clean Badge Version (with subtle cream background) ---
arr_badge = arr.copy()
np.random.seed(42)
noise = np.random.randint(-3, 4, size=(arr.shape[0], arr.shape[1], 3))
cream_fill = np.clip(bg + noise, 0, 255)
for c in range(3):
    arr_badge[:,:,c] = np.where(outside_all, cream_fill[:,:,c], arr_badge[:,:,c])

badge_alpha = np.clip((r_crop - 2 - circle_dist), 0, 1) * 255
arr_badge[:,:,3] = badge_alpha

logo_badge = Image.fromarray(np.clip(arr_badge, 0, 255).astype(np.uint8))
logo_badge.save('dist/images/logo-badge.png', 'PNG')
logo_badge.save('dist/images/logo-badge.webp', 'WEBP', quality=95)

print('Generated logo.png, logo.webp, logo-badge.png, logo-badge.webp, favicon.png, favicon.svg successfully!')
