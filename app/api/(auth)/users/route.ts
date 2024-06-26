import { User } from '@/lib/models/user';
import connect from '@/lib/db';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
const ObjectId = require('mongoose').Types.ObjectId;

// GET all users in the database.
export const GET = async () => {
  try {
    //Connect to db
    await connect();

    //Get all users and store it in variable.
    const users = await User.find();
    return new NextResponse(JSON.stringify(users));
  } catch (err: any) {
    return new NextResponse(`Error in fetching users: ${err.Message}`, {
      status: 500,
    });
  }
};

// POST - Create new user API
export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    await connect();

    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(JSON.stringify({ message: 'User is created.' }), {
      status: 201,
    });
  } catch (err: any) {
    return new NextResponse(`Error in creating user: ${err.Message}`, {
      status: 500,
    });
  }
};

// PATCH - Update user API
export const PATCH = async (request: Request) => {
  try {
    const { userId, newUsername } = await request.json();
    await connect();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: 'ID or new username was not found' }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid user ID.' }), {
        status: 400,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      {
        new: true, //return updated user instead of previously stored user
      }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: 'User was not found in the database.' }),
        {
          status: 400,
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: 'User is updated', user: updatedUser }),
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return new NextResponse(`Error in updating user: ${err.message}`, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url); // grab params from url
    const userId = searchParams.get('userId');

    //Error and Validation Handling
    if (!userId) {
      return new NextResponse(JSON.stringify({ message: 'ID was not found' }), {
        status: 400,
      });
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid user ID.' }), {
        status: 400,
      });
    }

    await connect();

    const userToDelete = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!userToDelete) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found in the database.' }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: 'User is deleted.', user: userToDelete }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse(`Error in deleting  user: ${err.message}`, {
      status: 500,
    });
  }
};
