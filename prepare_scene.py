from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import cv2
import numpy as np

root = Path(__file__).parent
assets = root / 'src/assets'
for name in ['agv', 'box']:
    im = Image.open(assets / f'sprite-{name}.png').convert('RGBA')
    a = np.array(im)
    strength = np.minimum(a[:,:,0].astype(float), a[:,:,2].astype(float)) - a[:,:,1]
    a[:,:,3] = np.clip((110-strength)*255/55, 0, 255).astype('uint8')
    out = Image.fromarray(a)
    out = out.crop(out.getbbox())
    out.thumbnail((420,420))
    out.save(assets / f'motion-{name}.png')

# Isolate the vehicle silhouette; the source crops also contain the dock and road.
polygons = {
 'a': [(39,30),(303,130),(310,155),(346,165),(375,191),(386,235),(381,291),(357,321),(324,337),(297,325),(279,316),(266,289),(214,269),(195,274),(176,256),(166,244),(97,211),(80,218),(61,204),(54,185),(39,177)],
 'b': [(18,20),(266,115),(273,140),(312,151),(342,182),(354,221),(350,278),(326,309),(292,321),(266,309),(254,284),(193,255),(175,257),(156,239),(147,223),(78,190),(62,196),(42,182),(34,161),(18,153)]
}
for name, polygon in polygons.items():
    im = Image.open(assets / f'truck-{name}-clean.png').convert('RGBA')
    mask = Image.new('L', im.size)
    ImageDraw.Draw(mask).polygon(polygon, fill=255)
    im.putalpha(mask.filter(ImageFilter.GaussianBlur(.5)))
    im.save(assets / f'motion-truck-{name}.png')

reference = root / '3D物流'
frames = []
for video in reference.glob('*.mp4'):
    cap = cv2.VideoCapture(str(video))
    count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    for fraction in [.2, .5, .8]:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(count*fraction))
        ok, frame = cap.read()
        if ok:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            im = Image.fromarray(frame)
            im.thumbnail((640,360))
            frames.append(im.copy())
    cap.release()
if frames:
    sheet = Image.new('RGB',(640*3,360*((len(frames)+2)//3)), '#eaf1f8')
    for i, im in enumerate(frames): sheet.paste(im,((i%3)*640,(i//3)*360))
    (root / 'artifacts').mkdir(exist_ok=True)
    sheet.save(root / 'artifacts/reference-video-frames.jpg')
