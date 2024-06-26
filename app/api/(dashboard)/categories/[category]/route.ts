import { Category } from '@/lib/models/category';
import { User } from '@/lib/models/user';
import connect from '@/lib/db';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';

export const PATCH = async (request: Request, context: { params: any }) => {
  //context.params.category: This extracts the category parameter from the route, which is expected to be part of the URL. For example, if the URL is /api/categories/123, context.params.category would be 123.
  const categoryId = context.params.category;

  try {
    const body = await request.json();
    const { title } = body; //destructure title from the body

    const { searchParams } = new URL(request.url); // Acquire params from URL
    const userId = searchParams.get('userId'); // Acquire userId param from URL

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or missing userId.' }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or missing categoryId.' }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found in the database.' }),
        { status: 400 }
      );
    }

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: 'Category not found in the database.' }),
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: 'Category is updated',
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse(
      `Error occured while updating category: ${err.Message}`,
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  //get category Id from URL using context.params
  const categoryId = context.params.category;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: 'Invalid or missing userId. User not found.',
        }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
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

    await Category.findByIdAndDelete(categoryId);

    return new NextResponse(
      JSON.stringify({
        message: `Category: "${category.title}" was successfully deleted.`,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse('Error in deleting category.' + error.message, {
      status: 500,
    });
  }
};
