import { Category } from '@/lib/models/category';
import { User } from '@/lib/models/user';
import { Blog } from '@/lib/models/blog';
import connect from '@/lib/db';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';

// GET: A Single Blog
export const GET = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;

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
        JSON.stringify({ message: 'Invalid or missing categoryId.' }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or missing categoryId.' }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: 'Error: Category not found.',
        }),
        {
          status: 404,
        }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      category: categoryId,
      user: userId,
    });

    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: 'Blog was not found.' }),
        {
          status: 404,
        }
      );
    }

    return new NextResponse(JSON.stringify({ blog }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse('Error in fetching blog data.' + error.message, {
      status: 500,
    });
  }
};

// PATCH: Apply partial update to existing blog
export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    const { title, description } = await request.json();
    const { searchParams } = new URL(request.url); // Acquire params from URL
    const userId = searchParams.get('userId'); // Acquire userId param from URL

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or missing userId.' }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    //const category = await Category.findById(categoryId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: 'User not found in the database.',
        }),
        { status: 404 }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });

    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: 'Blog not found in the database.' }),
        { status: 400 }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: 'Blog was successfully updated.',
        blog: updatedBlog,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse(
      `Error occured while updating blog: ${err.Message}`,
      {
        status: 500,
      }
    );
  }
};
