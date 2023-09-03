import { Command } from '@discord/base'
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from 'discord.js'
import { getInfoUserLeagueOfLegends } from '../../../routers/riotApis/getInfoRiot'

export default new Command({
  name: 'investigarjogador',
  description: 'Investigar informações do jogador pelo nome fornecido',
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'nome',
      description: 'Digitar nome do jogador a ser investigado',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  async run ({ interaction }) {
    const summonerNameRecive = interaction.options.getString('nome', true)
    await interaction.deferReply()
    try {
      const summonerInfo = await getInfoUserLeagueOfLegends(summonerNameRecive)
      if (summonerInfo === undefined) {
        const embedResponse = new EmbedBuilder()
          .setDescription(`Sr.${interaction.user.globalName}, permita-me corrigi-lo, no entanto, após uma revisão cuidadosa, não parece haver nenhum jogador com essa identificação que o senhor forneceu. Por favor, verifique se o nome está correto.`)
          .setColor('White')
        interaction.editReply({ embeds: [embedResponse] })
        return
      }

      const messageAuthor = interaction.user.globalName
      const embed = new EmbedBuilder()
        .setTitle(`Sr.${messageAuthor}entrego-lhe respeitosamente o relatório correspondente a investigação solicitada.`)
        .setColor('White')

      const embedProfile = new EmbedBuilder()
        .setTitle('Perfil')
        .addFields(
          { name: 'Nome', value: `${summonerInfo.profile.name}`, inline: true },
          { name: 'level', value: `${summonerInfo.profile.level}`, inline: true })
        .setThumbnail(summonerInfo.profile.icon)
        .setColor('White')

      const msgUnrankedSoloDuo = summonerInfo.summonerEloSoloDuoFlex.soloDuo.soloDuoElo === 'Unranked' ? 'Unranked' : `${summonerInfo.summonerEloSoloDuoFlex.soloDuo.soloDuoElo} ${summonerInfo.summonerEloSoloDuoFlex.soloDuo.soloDuoLiga}`
      const embedSoloDuo = new EmbedBuilder()
        .setTitle('Solo/Duo')
        .addFields(
          { name: 'Elo', value: `**${msgUnrankedSoloDuo}**`, inline: true },
          { name: 'Pontos', value: `${summonerInfo.summonerEloSoloDuoFlex.soloDuo.soloDuoPonts}`, inline: true },
          { name: '\u200B', value: '\n' },
          { name: 'Vitorias', value: `${summonerInfo.summonerEloSoloDuoFlex.soloDuo.soloDuoPontsWins}`, inline: true },
          { name: 'Derrotas', value: `${summonerInfo.summonerEloSoloDuoFlex.soloDuo.soloDuoPontsLosses}`, inline: true })
        .setColor('White')

      const msgUnrankedFlex = summonerInfo.summonerEloSoloDuoFlex.flex.flexElo === 'Unranked' ? 'Unranked' : `${summonerInfo.summonerEloSoloDuoFlex.flex.flexElo} ${summonerInfo.summonerEloSoloDuoFlex.flex.flexLiga}`
      const embedFlex = new EmbedBuilder()
        .setTitle('Flex')
        .addFields(
          { name: 'Elo', value: `**${msgUnrankedFlex}**`, inline: true },
          { name: 'Pontos', value: `${summonerInfo.summonerEloSoloDuoFlex.flex.flexPonts}`, inline: true },
          { name: '\u200B', value: '\n' },
          { name: 'Vitorias', value: `${summonerInfo.summonerEloSoloDuoFlex.flex.flexPontsWins}`, inline: true },
          { name: 'Derrotas', value: `${summonerInfo.summonerEloSoloDuoFlex.flex.flexPontsLosses}`, inline: true })
        .setColor('White')

      const msgUnrankedTft = summonerInfo.summonerEloTft.tftElo === 'Unranked' ? 'Unranked' : `${summonerInfo.summonerEloTft.tftElo} ${summonerInfo.summonerEloTft.tftLiga}`
      const embedTft = new EmbedBuilder()
        .setTitle('TFT')
        .addFields(
          { name: 'Elo', value: `**${msgUnrankedTft}**`, inline: true },
          { name: 'Pontos', value: `${summonerInfo.summonerEloTft.tftPonts}`, inline: true },
          { name: '\u200B', value: '\n' },
          { name: 'Vitorias', value: `${summonerInfo.summonerEloTft.tftPontsWins}`, inline: true },
          { name: 'Derrotas', value: `${summonerInfo.summonerEloTft.tftPontsLosses}`, inline: true })
        .setColor('White')

      const msgUnrankedTftDouble = summonerInfo.summonerEloTftDouble.tftDoubleElo === 'Unranked' ? 'Unranked' : `${summonerInfo.summonerEloTftDouble.tftDoubleElo} ${summonerInfo.summonerEloTftDouble.tftDoubleLiga}`
      const embedTftDouble = new EmbedBuilder()
        .setTitle('TFT-DUPLA')
        .addFields(
          { name: 'Elo', value: `**${msgUnrankedTftDouble}**`, inline: true },
          { name: 'Pontos', value: `${summonerInfo.summonerEloTftDouble.tftDoublePonts}`, inline: true },
          { name: '\u200B', value: '\n' },
          { name: 'Vitorias', value: `${summonerInfo.summonerEloTftDouble.tftDoublePontsWins}`, inline: true },
          { name: 'Derrotas', value: `${summonerInfo.summonerEloTftDouble.tftDoublePontsLosses}`, inline: true })
        .setColor('White')

      interaction.editReply({ embeds: [embed, embedProfile, embedSoloDuo, embedFlex, embedTft, embedTftDouble] })
    } catch (error) {
      console.error('Erro ao processar o comando:', error)
      const errorResponse = new EmbedBuilder()
        .setDescription('Desculpe, ocorreu um erro ao processar o comando. Por favor, tente novamente mais tarde.')
        .setColor('Red')
      interaction.editReply({ embeds: [errorResponse] })
    }
  }
})
