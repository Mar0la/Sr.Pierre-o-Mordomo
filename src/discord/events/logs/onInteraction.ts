/* eslint-disable no-useless-return */
import { Event } from '@discord/base'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CategoryChannel, ChannelType, time, AutocompleteInteraction, EmbedBuilder } from 'discord.js'
import { iterate } from 'glob'

const processedInteractions = new Set()
export default new Event({
  name: 'interactionCreate',
  async run (client, interaction) {
    if (!interaction.inCachedGuild() || processedInteractions.has(interaction.id)) return

    processedInteractions.add(interaction.id)
    if (!interaction.inCachedGuild()) return

    let verifyCategoryLogsExists = interaction.guild.channels.cache.find((category: { name: string }) => category.name === 'logs')
    if (verifyCategoryLogsExists === undefined) {
      const creatCategoryLogs = await interaction.guild.channels.create({
        name: 'logs',
        topic: 'Logs',
        type: ChannelType.GuildCategory
      })
      verifyCategoryLogsExists = creatCategoryLogs
    }

    let verifyChannelLogCommandsExists = interaction.guild.channels.cache.find((channel) => channel.type === ChannelType.GuildText && channel.name === 'logs-de-comandos' && channel.parentId === verifyCategoryLogsExists?.id)
    if (!verifyChannelLogCommandsExists) {
      const creatChannelLogsCommands = await interaction.guild.channels.create({
        name: 'logs-de-comandos',
        topic: 'Log de todos os comandos do servidor',
        parent: verifyCategoryLogsExists.id,
        type: ChannelType.GuildText
      })
      verifyChannelLogCommandsExists = creatChannelLogsCommands
    }

    let verifyChannelLogErrosExists = interaction.guild.channels.cache.find((channel) => channel.type === ChannelType.GuildText && channel.name === 'logs-de-erros' && channel.parentId === verifyCategoryLogsExists?.id)
    if (!verifyChannelLogErrosExists) {
      const creatChannelLogsErros = await interaction.guild.channels.create({
        name: 'logs-de-erros',
        topic: 'Log de todos os erros em execução',
        parent: verifyCategoryLogsExists.id,
        type: ChannelType.GuildText
      })
      verifyChannelLogErrosExists = creatChannelLogsErros
    }

    if (interaction.isCommand()) {
      const logsChannel = interaction.guild.channels.cache.get(verifyChannelLogCommandsExists.id)
      if (!logsChannel?.isTextBased()) return

      const authorName = interaction.user.globalName || 'Nome Desconhecido'
      const userId = interaction.user.id
      const authorCreatedAt = interaction.user.createdAt
      const formattedAuthorCreatedAt = format(authorCreatedAt, 'dd \'de\' MMMM \'de\' yyyy \'às\' HH:mm \'', { locale: ptBR })
      const authorJoinServe = interaction.guild.joinedAt
      const formatteduserjoinServeDate = format(authorJoinServe, "d 'de' MMMM 'de' yyyy 'às' HH:mm '", { locale: ptBR })

      const userCommandLog = []
      const { channel, user, commandName, createdAt } = interaction

      const messages = await logsChannel.messages.fetch()
      const existingMessage = messages.find((message) =>
        message.embeds[0]?.fields[0]?.value === authorName
      )

      let content = `**@${user.globalName} usou o comando: ${commandName}`
      if (channel) content += ` em ${channel.url} as  ${time(createdAt)}**`
      userCommandLog.push(content)
      const embedLog = new EmbedBuilder()
        .setTitle(`Sr.${authorName}, entrego-lhe respeitosamente o registro de comandos do usuário.`)
        .addFields(
          { name: 'Username', value: `${authorName}` },
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          { name: 'Data de criação da conta', value: `${formattedAuthorCreatedAt}` },
          { name: 'Data que o usuário entrou no servidor', value: `${formatteduserjoinServeDate}` },
          { name: 'Comandos', value: userCommandLog.join('\n') })
        .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
        .setColor('White')

      if (existingMessage) {
        const existingEmbed = existingMessage.embeds[0]
        if (existingEmbed) {
          const userCommandLogField = existingEmbed.fields.find(
            (field) => field.name === 'Comandos'
          )
          if (userCommandLogField) {
            const updatedLog = `${userCommandLogField.value}\n${userCommandLog.join('\n')}`
            if (updatedLog.length <= 1000) {
              userCommandLogField.value = updatedLog
              await existingMessage.edit({ embeds: [existingEmbed] })
            } else {
              logsChannel.send({ embeds: [embedLog] })
            }
          }
        }
      } else {
        logsChannel.send({ embeds: [embedLog] })
      }
    }
  }
})
