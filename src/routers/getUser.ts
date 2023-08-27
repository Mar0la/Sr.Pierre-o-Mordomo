import axios from 'axios'
import { processEnv } from '@/settings'

const { BOT_TOKEN } = processEnv
const TOKEN = BOT_TOKEN
const headers = {
  Authorization: `Bot ${TOKEN}`
}

export default async function GetUserForId (userId: string) {
  try {
    const response = await axios.get(`https://discord.com/api/v10/users/${userId}`, { headers })

    return response.data
  } catch (error) {
    console.error('Erro na solicitação:', error)
    throw error
  }
}
