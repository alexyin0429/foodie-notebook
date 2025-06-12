from PIL import Image
from io import BytesIO

def process_image(image_bytes, max_size=1200, quality=85):
    """压缩图片并调整大小"""
    try:
        img = Image.open(BytesIO(image_bytes))
        
        # 调整大小
        img.thumbnail((max_size, max_size))
        
        # 转换格式为JPEG
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # 保存到内存
        img_buffer = BytesIO()
        img.save(img_buffer, format="JPEG", quality=quality)
        img_buffer.seek(0)
        
        return img_buffer
        
    except Exception as e:
        raise ValueError(f"Image processing failed: {str(e)}")