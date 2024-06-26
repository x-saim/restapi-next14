import { Category } from '@/lib/models/category';
import { User } from '@/lib/models/user';
import connect from '@/lib/db';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';

// GET Request

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url); // Acquire params from URL
    const userId = searchParams.get('userId'); // Acquire userId param from URL

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or missing userId' }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found in the database' }),
        { status: 400 }
      );
    }

    // Get all categories given the userId
    const categories = await Category.find({
      user: new Types.ObjectId(userId), //specifies that we want to find all documents in the Category collection where the user field matches the given userId.
    });

    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (err: any) {
    return new NextResponse(
      `Error in fetching user's categories: ${err.Message}`,
      {
        status: 500,
      }
    );
  }
};

// POST Request

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get('userId');

    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or missing userId.' }),
        {
          status: 400,
        }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User was not found.' }),
        {
          status: 404,
        }
      );
    }
    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });

    await newCategory.save();

    return new NextResponse(
      JSON.stringify({
        message: 'Category was successfully created.',
        category: newCategory,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse('Error in creating category.' + error.message, {
      status: 500,
    });
  }
};
