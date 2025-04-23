import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../_lib/mongodb";
import Product from "../../_models/Products";
import { editFileInS3, uploadFileToS3 } from "../../_lib/aws-s3";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  await dbConnect();
  const { productId } = await params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error fetching product" },
      { status: 400 }
    );
  }
}

export async function PUT(
  request,
  { params }: { params: Promise<{ productId: string }> }
) {
  await dbConnect();
  const { productId } = await params;

  try {
    const formData = await request.formData();

    const file = formData.get("file");
    let body = {
      name: formData.get("name"),
      description: formData.get("description"),
      sku: formData.get("sku"),
      category: formData.get("category"),
      stockQuantity: formData.get("stockQuantity"),
      price: formData.get("price"),
      imageUrl: formData.get("imageUrl"),
    };

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      function validateImageFile(fileName) {
        const regex = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i;
        return regex.test(fileName);
      }
      if (!validateImageFile(file.name))
        throw Error("Invalid format for image prodcut.");

      function normalizeFileName(fileNameWithExtention) {
        const date = new Date().getTime();
        let newFileName = "";
        let extention = "";
        let fileName = "";

        const fragments = fileNameWithExtention.split(".");
        const regex = /(jpg|jpeg|png|gif|webp|svg|bmp)$/i;
        fragments.forEach((element) => {
          if (regex.test(element)) {
            extention = element;
          } else {
            fileName = fileName + element;
          }
        });

        if (!fileName || !extention)
          throw Error("Error, file name was not read");

        newFileName = `${fileName}-${date}.${extention}`;
        return newFileName;
      }
      const fileName = normalizeFileName(file.name);

      let filePath;

      if (body.imageUrl === "/images/products/image-product-default.jpg") {
        filePath = await uploadFileToS3(buffer, fileName);
      } else {
        filePath = await editFileInS3(buffer, body.imageUrl);
      }
      body.imageUrl = filePath;
    }

    const product = await Product.findByIdAndUpdate(productId, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error updating product" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  await dbConnect();
  const { productId } = await params;

  try {
    const deletedProduct = await Product.deleteOne({ _id: productId });

    if (!deletedProduct.deletedCount) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error deleting product" },
      { status: 400 }
    );
  }
}
