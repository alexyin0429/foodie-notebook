from io import BytesIO
from fastapi import APIRouter, UploadFile, Form, HTTPException, Depends
from supabase import Client
from ..dependencies import get_supabase
from ..utils.image_processing import process_image
import uuid

router = APIRouter()

@router.post("/dishes")
async def create_dish(
    dish_name: str = Form(...),
    ingredients: str = Form(...),
    image: UploadFile = None,
    supabase: Client = Depends(get_supabase)
):
    try:
        image_url = None
        if image and image.filename:
            raw_bytes = await image.read()
            processed_img: BytesIO = process_image(raw_bytes)
            data_bytes = processed_img.getvalue()

            ext = image.filename.rsplit('.', 1)[-1]
            file_name = f"{uuid.uuid4()}.{ext}"
            file_path = f"dishes/{file_name}"

            res = supabase.storage.from_("dish-images").upload(
                file_path,
                data_bytes,
                {"contentType": image.content_type}
            )

            url_data = supabase.storage.from_("dish-images").get_public_url(file_path)

        dish_data = {
            "dish_name": dish_name,
            "ingredients": [i.strip() for i in ingredients.split(",")],
        }
        if image_url:
            dish_data["image_url"] = url_data

        response = supabase.table("dishes").insert(dish_data).execute()

        return response.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dishes/search")
async def search_dishes(q: str, supabase: Client = Depends(get_supabase)):
    return supabase.rpc('search_dishes', {'query': q}).execute()


@router.delete("/dishes/{dish_id}")
async def delete_dish(
    dish_id: str,
    supabase: Client = Depends(get_supabase)
):
    try:
        # First get the dish to check if it exists and get the image URL
        dish_response = supabase.table("dishes").select("image_url").eq("id", dish_id).execute()
        
        if not dish_response.data:
            raise HTTPException(status_code=404, detail="Dish not found")
            
        dish = dish_response.data[0]
        
        # If there's an image, delete it from storage
        if dish.get("image_url"):
            # Extract file path from URL
            url_parts = dish["image_url"].split('/')
            file_path = '/'.join(url_parts[url_parts.index('dishes'):])
            
            # Delete from storage
            supabase.storage.from_("dish-images").remove([file_path])
        
        # Delete the dish record
        response = supabase.table("dishes").delete().eq("id", dish_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dish not found")
            
        return {"message": "Dish deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/dishes/{dish_id}")
async def update_dish(
    dish_id: str,
    dish_name: str = Form(...),
    ingredients: str = Form(...),
    image: UploadFile = None,
    supabase: Client = Depends(get_supabase)
):
    try:
        # First get the dish to check if it exists and get the current image URL
        dish_response = supabase.table("dishes").select("image_url").eq("id", dish_id).execute()
        
        if not dish_response.data:
            raise HTTPException(status_code=404, detail="Dish not found")
            
        current_dish = dish_response.data[0]
        
        # Prepare update data
        update_data = {
            "dish_name": dish_name,
            "ingredients": [i.strip() for i in ingredients.split(",")],
        }
        
        # Handle image upload if provided
        if image and image.filename:
            # Delete old image if exists
            if current_dish.get("image_url"):
                url_parts = current_dish["image_url"].split('/')
                old_file_path = '/'.join(url_parts[url_parts.index('dishes'):])
                supabase.storage.from_("dish-images").remove([old_file_path])
            
            # Process and upload new image
            raw_bytes = await image.read()
            processed_img: BytesIO = process_image(raw_bytes)
            data_bytes = processed_img.getvalue()

            ext = image.filename.rsplit('.', 1)[-1]
            file_name = f"{dish_id}.{ext}"
            file_path = f"dishes/{file_name}"

            res = supabase.storage.from_("dish-images").upload(
                file_path,
                data_bytes,
                {"contentType": image.content_type}
            )

            url_data = supabase.storage.from_("dish-images").get_public_url(file_path)
            update_data["image_url"] = url_data

        # Update the dish record
        response = supabase.table("dishes").update(update_data).eq("id", dish_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dish not found")
            
        return response.data[0]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))