import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({}, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }).end(buffer);
    });

    return Response.json(uploadResponse);
  } catch (err) {
    return Response.json({ error: "Upload failed", details: err });
  }
}
