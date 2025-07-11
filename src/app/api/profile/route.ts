// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'


export async function PUT(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Get the current user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, location, salary, familySize, avatarUrl } = body

    // Update user in database
    const {data: updatedUser, error: dbError} = await supabase
    .from('users')
    .upsert(
      [
        {
        id: user.id,
        email: user.email,
        name,
        location,
        salary: salary ? parseFloat(salary) : null,
        familySize: familySize ? parseInt(familySize) : null,
        avatarUrl,
        },
      ],
      {onConflict: 'email'}
    )
    .select()
    .single()

    if (dbError){
      console.error('Error updating user in Supabase table:', dbError)
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      )
    }

    // Update user metadata in Supabase
    const { error: metaError } = await supabase.auth.updateUser({
      data: {
        name,
        location,
        salary,
        familySize,
        avatarUrl,
      }
    })

    if (metaError) {
      console.error('Error updating Supabase user metadata:', metaError)
      // Don't return error since database update succeeded
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}