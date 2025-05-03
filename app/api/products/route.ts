import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../_lib/mongodb";
import Product from "../_models/Products";
import { uploadFileToS3 } from "../_lib/aws-s3";
import { getPaginationParams, validateCategory } from "../_helpers/pagination";
import { defaultImageUrl } from "../../(client)/_lib/constant";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { page, limit, skip } = getPaginationParams(req.url);

  const { searchParams } = new URL(req.url);
  const featured = parseInt(searchParams.get("featured") || "0", 10);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const available = searchParams.get("available") || "";

  try {
    let filter: any = {};
    let sort: any = {};

    if (featured) filter = { ...filter };
    if (available) filter = { ...filter, isAvailable: true };

    if (category) {
      filter = {
        ...filter,
        category: category,
      };
    }

    if (search) {
      filter = {
        ...filter,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { sku: { $regex: search, $options: "i" } },
        ],
      };
    } else {
      sort = { createdAt: "desc" };
    }

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    return NextResponse.json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: products,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error fetching products" },
      { status: 400 }
    );
  }
}

export async function POST(request) {
  await dbConnect();

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
      imageUrl: defaultImageUrl,
    };

    validateCategory(body.category);

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

        fileName = fileName.replace(" ", "-");

        if (!fileName || !extention)
          throw Error("Error, file name was not read");

        newFileName = `${fileName}-${date}.${extention}`;
        return newFileName;
      }
      const fileName = normalizeFileName(file.name);

      const filePath = await uploadFileToS3(buffer, fileName);
      body.imageUrl = filePath;
    }

    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
