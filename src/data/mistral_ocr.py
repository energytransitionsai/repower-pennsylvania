from mistralai import Mistral
import os
import base64
import glob

def ocr_pdf_to_markdown(pdf_path, api_key, output_base_dir="OCR_Output"):
    client = Mistral(api_key=api_key)
    
    print(f"Processing: {pdf_path}")
    
    # Create folder for this file (clean up name for folder)
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    output_folder_name = base_name.replace(" ", "_").replace("'", "").replace(":", "").replace("–", "-").replace("'", "")
    output_folder = os.path.join(output_base_dir, output_folder_name)
    os.makedirs(output_folder, exist_ok=True)
    
    # Upload PDF file
    uploaded_pdf = client.files.upload(
        file={
            "file_name": os.path.basename(pdf_path),
            "content": open(pdf_path, "rb"),
        },
        purpose="ocr"
    )
    
    # Get signed URL
    signed_url = client.files.get_signed_url(file_id=uploaded_pdf.id)
    
    # Process OCR with images
    ocr_response = client.ocr.process(
        model="mistral-ocr-latest",
        document={
            "type": "document_url",
            "document_url": signed_url.url,
        },
        include_image_base64=True  # Include images!
    )
    
    # Extract text and save images
    text = ""
    image_count = 0
    
    for page_num, page in enumerate(ocr_response.pages, 1):
        text += f"## Page {page_num}\n\n"
        text += page.markdown + '\n\n'
        
        # Save images from this page
        if hasattr(page, 'images') and page.images:
            for img_num, image in enumerate(page.images, 1):
                if hasattr(image, 'image_base64') and image.image_base64:
                    image_count += 1
                    
                    # Handle data URL format - strip prefix if present
                    base64_data = image.image_base64
                    if base64_data.startswith('data:'):
                        # Extract just the base64 part after the comma
                        comma_index = base64_data.find(',')
                        if comma_index != -1:
                            base64_data = base64_data[comma_index + 1:]
                    
                    # Determine file extension from data URL or default to jpg
                    if image.image_base64.startswith('data:image/jpeg'):
                        ext = 'jpg'
                    elif image.image_base64.startswith('data:image/png'):
                        ext = 'png'
                    else:
                        ext = 'jpg'  # Default to jpg
                    
                    img_filename = f"{output_folder}/page_{page_num}_image_{img_num}.{ext}"
                    
                    # Decode and save image
                    try:
                        img_data = base64.b64decode(base64_data)
                        with open(img_filename, 'wb') as img_file:
                            img_file.write(img_data)
                        
                        print(f"Saved image: {img_filename}")
                    except Exception as e:
                        print(f"Error saving {img_filename}: {e}")
    
    # Save markdown file in the folder
    md_filename = f"{output_folder}/{base_name}.md"
    with open(md_filename, 'w', encoding='utf-8') as f:
        f.write(f"# OCR Results: {os.path.basename(pdf_path)}\n\n")
        f.write(f"**Total Pages:** {len(ocr_response.pages)}\n")
        f.write(f"**Images Extracted:** {image_count}\n\n")
        f.write(text)
    
    print(f"Saved markdown to: {md_filename}")
    print(f"Extracted {image_count} images")
    return text

# Process ALL PDFs in the Reports folder (not subfolders)
api_key = "uYCO4MgxvC6bECjH5ukRAEtKI0G82MJy"

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Create output directory in Reports folder
output_base = os.path.join(script_dir, "OCR_Output")
os.makedirs(output_base, exist_ok=True)

# Find all PDF files in the Reports folder (not subfolders)
pdf_files = [f for f in os.listdir(script_dir) if f.endswith('.pdf') and os.path.isfile(os.path.join(script_dir, f))]
print(f"Found {len(pdf_files)} PDF files in Reports folder:")
for pdf in pdf_files:
    print(f"  - {pdf}")

for pdf_file in pdf_files:
    try:
        pdf_path = os.path.join(script_dir, pdf_file)
        result = ocr_pdf_to_markdown(pdf_path, api_key, output_base)
        print(f"✓ Completed {pdf_file}")
        print("-" * 50)
    except Exception as e:
        print(f"✗ Error processing {pdf_file}: {e}")
        print("-" * 50) 