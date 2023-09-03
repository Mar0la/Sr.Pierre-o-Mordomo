import axios from 'axios'
import { processEnv } from '@/settings'

interface Summoner {
  id: string
  profileIconId: number
  name: string
  summonerLevel: number
}

interface RankedInfo {
  tier: string
  rank: string
  leaguePoints: number
  wins: number
  losses: number
}

class LeagueOfLegendsService {
  private readonly apiKey: string
  private readonly headers: Record<string, string>

  constructor (apiKey: string) {
    this.apiKey = apiKey
    this.headers = {
      'X-Riot-Token': apiKey
    }
  }

  async getSummonerInfo (summonerName: string) {
    try {
      const response = await axios.get(`https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`, { headers: this.headers })
      return response.data
    } catch (error) {
      console.error('Erro ao obter dados do invocador:', error)
      throw error
    }
  }

  async getEloSoloDuoFlex (summonerId: string) {
    try {
      const response = await axios.get(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`, { headers: this.headers })

      const soloDuoRank = response.data.find((rank: { queueType: string }) => rank.queueType === 'RANKED_SOLO_5x5') || {}
      console.log(soloDuoRank)
      const flexRank = response.data.find((rank: { queueType: string }) => rank.queueType === 'RANKED_FLEX_SR') || {}
      return {
        soloDuo: {
          soloDuoElo: soloDuoRank.tier || 'Unranked',
          soloDuoLiga: soloDuoRank.rank || 'Unranked',
          soloDuoPonts: soloDuoRank.leaguePoints || 0,
          soloDuoPontsWins: soloDuoRank.wins || 0,
          soloDuoPontsLosses: soloDuoRank.losses || 0
        },
        flex: {
          flexElo: flexRank.tier || 'Unranked',
          flexLiga: flexRank.rank || 'Unranked',
          flexPonts: flexRank.leaguePoints || 0,
          flexPontsWins: flexRank.wins || 0,
          flexPontsLosses: flexRank.losses || 0
        }
      }
    } catch (error) {
      console.error('Erro obter elo da Solo/Dou ou Flex:', error)
      throw error
    }
  }

  async getEloTft (summonerId: string) {
    try {
      const response = await axios.get(`https://br1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerId}`, { headers: this.headers })
      const tftRank = response.data.find((rank: { queueType: string }) => rank.queueType === 'RANKED_TFT') || {}
      return {
        tftElo: tftRank.tier || 'Unranked',
        tftLiga: tftRank.rank || 'Unranked',
        tftPonts: tftRank.leaguePoints || 0,
        tftPontsWins: tftRank.wins || 0,
        tftPontsLosses: tftRank.losses || 0
      }
    } catch (error) {
      console.error('Erro ao obter elo do TFT:', error)
      throw error
    }
  }

  async getEloTftDouble (summonerId: string) {
    try {
      const response = await axios.get(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`, { headers: this.headers })
      const tftDuoubleRank = response.data.find((rank: { queueType: string }) => rank.queueType === 'RANKED_TFT_DOUBLE_UP') || {}
      return {
        tftDoubleElo: tftDuoubleRank.tier || 'Unranked',
        tftDoubleLiga: tftDuoubleRank.rank || 'Unranked',
        tftDoublePonts: tftDuoubleRank.leaguePoints || 0,
        tftDoublePontsWins: tftDuoubleRank.wins || 0,
        tftDoublePontsLosses: tftDuoubleRank.losses || 0
      }
    } catch (error) {
      console.error('Erro ao obter elo do TFT DUPLA:', error)
      throw error
    }
  }

  async getPatch () {
    try {
      const response = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
      return response.data[0]
    } catch (error) {
      console.error('Erro ao obter patch:', error)
      throw error
    }
  }
}
export async function getInfoUserLeagueOfLegends (summonerName: string) {
  try {
    const { RIOT_LEAGUEOFLEGENDS_TOKEN } = processEnv

    const apiKey: string = RIOT_LEAGUEOFLEGENDS_TOKEN as string
    const lolService = new LeagueOfLegendsService(apiKey)
    const patchVersion = await lolService.getPatch()

    const summoner = await lolService.getSummonerInfo(summonerName)
    const summonerEloSoloDuoFlex = await lolService.getEloSoloDuoFlex(summoner.id)
    const summonerEloTft = await lolService.getEloTft(summoner.id)
    const summonerEloTftDouble = await lolService.getEloTftDouble(summoner.id)
    const summonerIconUrl = `http://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.profileIconId}.png`
    const profile = {
      name: summoner.name,
      icon: summonerIconUrl,
      level: summoner.summonerLevel
    }
    return {
      profile,
      summonerEloSoloDuoFlex,
      summonerEloTft,
      summonerEloTftDouble
    }
  } catch (error) {
    console.error('Erro ao obter informações de League of Legends:', error)
  }
}
