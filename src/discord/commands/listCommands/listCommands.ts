import { Command } from '@discord/base'
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from 'discord.js'

export default new Command({
  name: 'comandos',
  description: 'Exibir lista de comandos',
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  async run ({ interaction }) {
    try {
      const listCommands = new EmbedBuilder()
        .setTitle('Sr. Pierre, o Mordomo ao seu dispor. Merci\n\nLista de comandos')
        .addFields(
          { name: 'investigar', value: 'Eu me disponho a trazer um relatório minucioso, abrangendo todas as informações que encontrei.' },
          { name: 'investigarjogador', value: 'Eu me disponho a trazer um relatório minucioso, abrangendo todas as informações que encontrei sobre o jogador.' }
        )
        .setFooter({
          text: 'Permita-me apresentar uma lista de comandos Apps disponíveis, prontamente à vossa disposição.',
          iconURL: interaction.client.user.avatarURL() || undefined
        })
        .setTimestamp()
        .setThumbnail(interaction.client.user.avatarURL())
        .setColor('White')
      interaction.reply({ embeds: [listCommands] })
    } catch (error) {
      console.error('Erro ao processar o comando:', error)
      const errorResponse = new EmbedBuilder()
        .setDescription('Desculpe, ocorreu um erro ao processar o comando. Por favor, tente novamente mais tarde.')
        .setColor('Red')
      interaction.editReply({ embeds: [errorResponse] })
    }
  }
})
