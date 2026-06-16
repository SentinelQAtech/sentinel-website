import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SupabaseLoginDto {
  @ApiProperty({ description: 'Supabase access_token obtained from client-side auth' })
  @IsString()
  @IsNotEmpty()
  accessToken!: string
}
