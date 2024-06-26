import { Category } from '@/lib/models/category';
import { User } from '@/lib/models/user';
import { Blog } from '@/lib/models/blog';
import connect from '@/lib/db';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const categoryId = searchParams.get('categoryId');

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or missing userId' }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
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

    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message:
            'Error: Either the Category not found or it does not belong to the user.',
        }),
        {
          status: 404,
        }
      );
    }

    const blogFilter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    const userBlogs = await Blog.find(blogFilter);

    return new NextResponse(JSON.stringify({ userBlogs }), { status: 200 });
  } catch (err: any) {
    return new NextResponse(`Error in fetching blogs: ${err.Message}`, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const categoryId = searchParams.get('categoryId');

    const body = await request.json();

    // Validate params
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or missing userId' }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or missing userId' }),
        { status: 400 }
      );
    }
    const user = await User.findById(userId);

    //Validate user and category against database.
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found in the database' }),
        { status: 400 }
      );
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message:
            'Error: Either the Category not found or it does not belong to the user.',
        }),
        {
          status: 404,
        }
      );
    }

    await connect();

    const newBlog = new Blog({
      title: body.title,
      description: body.description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return new NextResponse(
      JSON.stringify({
        message: 'Blog was successfully created.',
        blog: newBlog,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse(`Error in creating blog: ${err.Message}`, {
      status: 500,
    });
  }
};
