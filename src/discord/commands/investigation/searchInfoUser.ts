/* eslint-disable no-cond-assign */
import { Command } from '@discord/base'
import GetUserForId from '../../../routers/discordApi/getUser'
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from 'discord.js'
import { format, differenceInYears, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default new Command({
  name: 'investigar',
  description: 'Investigar informaçoes do usuario fornecido',
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'id',
      description: 'id do usuario',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],

  async run ({ interaction }) {
    const idUserRecive = interaction.options.getString('id', true)
    if (!(idUserRecive.length === 18) || idUserRecive.match(/[a-z]/g)) {
      const embedResponse = new EmbedBuilder()
        .setDescription(`Sr.${interaction.user.globalName}, permita-me corrigi-lo, no entanto, após uma revisão cuidadosa, não parece haver nenhuma pessoa com essa identificação que o senhor forneceu. Por favor, verifique se o ID está correto.`)
        .setColor('White')
      interaction.reply({ embeds: [embedResponse] })
      return
    }
    const infoUserApi = await GetUserForId(idUserRecive)

    const searchUserInServerDiscord = await interaction.guild.members.fetch(idUserRecive).catch(() => null)
    let userCreatedAt
    let formattedUserCreatedAt
    let yearsDifferenceCreatedAt
    let userjoinServeDate
    let formatteduserjoinServeDate
    let yearsDifferenceUserJoinServe
    if (searchUserInServerDiscord != null) {
      userCreatedAt = searchUserInServerDiscord.user.createdAt
      formattedUserCreatedAt = format(userCreatedAt, 'dd \'de\' MMMM \'de\' yyyy \'às\' HH:mm \'', { locale: ptBR })
      yearsDifferenceCreatedAt = differenceInYears(new Date(), userCreatedAt) > 0 ? `há ${differenceInYears(new Date(), userCreatedAt)} anos` : 'Entrou esse ano'

      userjoinServeDate = searchUserInServerDiscord.guild.joinedAt
      formatteduserjoinServeDate = format(userjoinServeDate, "d 'de' MMMM 'de' yyyy 'às' HH:mm '", { locale: ptBR })
      yearsDifferenceUserJoinServe = differenceInYears(new Date(), userjoinServeDate) > 0 ? `há ${differenceInYears(new Date(), userjoinServeDate)} anos` : 'Entrou esse ano'
    }

    const messageAuthor = interaction.user.globalName
    const embedResponse = new EmbedBuilder()
      .setTitle(`Sr.${messageAuthor}, entrego-lhe respeitosamente o relatório correspondente a investigação solicitada.`)
      .addFields(
        { name: 'Username', value: `${infoUserApi.global_name}` },
        { name: 'Nickname', value: `${infoUserApi.username}` },
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        { name: 'Data de criação da conta', value: searchUserInServerDiscord ? `${formattedUserCreatedAt} **(${yearsDifferenceCreatedAt})**` : 'Somente disponivel para usarios da servindor' },
        { name: 'Data que o usuário entrou no servidor', value: searchUserInServerDiscord ? `${formatteduserjoinServeDate}**(${yearsDifferenceUserJoinServe})**` : 'Somente disponivel para usarios da servindor' })
      .setThumbnail(`https://cdn.discordapp.com/avatars/${infoUserApi.id}/${infoUserApi.avatar}.png`)
      .setColor('White')
    interaction.reply({ embeds: [embedResponse] })
  }
})
