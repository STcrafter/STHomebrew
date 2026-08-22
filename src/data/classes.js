export default [
  // ============================================================
//   Класс Dancer (Complete Dancer, Mage Hand Press, 2024)
// ============================================================

{
  id: 'class-dancer',
  name: 'Dancer',
  description: 'Masters of movement, Dancers leverage their unearthly grace and charm to glide unfettered through the battlefield. Dance isn\'t merely a combination of rhythm and footwork—it is a Dancer\'s intrinsic expression, embodying a magic all its own. When a Dancer enters their flow state, they bound past lethal strikes and strike with a dramatic flourish, felling foes with a tempo that is at once elegant and fearsome.',
  image: '/images/dancer.jpg', // можете заменить на свою картинку

  primary_ability: 'Dexterity and Charisma',
  saving_throws: ['Dexterity', 'Charisma'],
  hit_die: 'd8',
  class_table: [
  { level: 1, proficiency_bonus: 2, dances: 1, dance_die: 'd4' },
  { level: 2, proficiency_bonus: 2, dances: 2, dance_die: 'd4' },
  { level: 3, proficiency_bonus: 2, dances: 2, dance_die: 'd4' },
  { level: 4, proficiency_bonus: 2, dances: 2, dance_die: 'd4' },
  { level: 5, proficiency_bonus: 3, dances: 3, dance_die: 'd6' },
  { level: 6, proficiency_bonus: 3, dances: 3, dance_die: 'd6' },
  { level: 7, proficiency_bonus: 3, dances: 3, dance_die: 'd6' },
  { level: 8, proficiency_bonus: 3, dances: 3, dance_die: 'd6' },
  { level: 9, proficiency_bonus: 4, dances: 4, dance_die: 'd6' },
  { level: 10, proficiency_bonus: 4, dances: 4, dance_die: 'd6' },
  { level: 11, proficiency_bonus: 4, dances: 4, dance_die: 'd8' },
  { level: 12, proficiency_bonus: 4, dances: 4, dance_die: 'd8' },
  { level: 13, proficiency_bonus: 5, dances: 5, dance_die: 'd8' },
  { level: 14, proficiency_bonus: 5, dances: 5, dance_die: 'd8' },
  { level: 15, proficiency_bonus: 5, dances: 5, dance_die: 'd8' },
  { level: 16, proficiency_bonus: 5, dances: 5, dance_die: 'd8' },
  { level: 17, proficiency_bonus: 6, dances: 6, dance_die: 'd10' },
  { level: 18, proficiency_bonus: 6, dances: 6, dance_die: 'd10' },
  { level: 19, proficiency_bonus: 6, dances: 6, dance_die: 'd10' },
  { level: 20, proficiency_bonus: 6, dances: 6, dance_die: 'd10' },
],
  proficiencies: {
    armor: ['Light armor'],
    weapons: ['Simple weapons', 'Martial weapons that have the Finesse or Light property'],
    tools: [], // нет инструментов
    saving_throws: ['Dexterity', 'Charisma'], // дублируется, но оставим для полноты
    skills: {
      choices: 2,
      options: ['Acrobatics', 'Deception', 'Insight', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth']
    }
  },

  equipment: 'Studded Leather Armor, 3 Daggers, 4 Darts, Whip, Explorer\'s Pack, and 12 GP',

  // ===== Особенности класса (по уровням) =====
  features: [
    {
      level: 1,
      name: 'Dervish Fighting',
      description: 'Your graceful movements and skill with nimble weapons grant you the following benefits.\n\nDeadly D4s. Whenever you roll damage with a weapon that deals 1d4 or 1d6 damage or an Unarmed Strike, you can deal 2d4 damage instead.\n\nExtra Finesse Weapons. While wielding a weapon that deals 1d4 or 1d6 damage, it has the Finesse property for you.'
    },
    {
      level: 1,
      name: 'Unarmored Defense',
      description: 'While you aren\'t wearing armor or wielding a Shield, your base Armor Class equals 10 plus your Dexterity and Charisma modifiers.'
    },
    {
      level: 1,
      name: 'Weapon Mastery',
      description: 'Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have proficiency, such as Daggers and Hand Crossbows. Whenever you finish a Long Rest, you can change the kinds of weapons you chose.'
    },
    {
      level: 2,
      name: 'Dance',
      description: 'You can enter a flow state of Dance as a Bonus Action if you aren\'t wearing Heavy armor. Your Dance lasts for 1 minute, or until you have the Incapacitated condition, your Speed is 0, or you choose to stop dancing (no action required).\n\nYou can begin your Dance a number of times shown for your Dancer level in the Dances column of the Dancer features table. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.\n\nDance Die. Your dancing prowess is represented by a Dance Die, which is a d4. This die changes when you reach certain Dancer levels, as shown in the Dance Die column of the Dancer Features table.\n\nGraceful Dodge. If a creature you can see hits you with an attack while your Dance is active, you can roll your Dance Die and add it to your Armor Class against this attack, potentially causing the attack to miss you.'
    },
    {
      level: 2,
      name: 'Dance Styles',
      description: 'When you begin your Dance, choose one of the following Dance Styles. You gain the benefits of this style until your Dance ends or you switch to another one as a Bonus Action.\n\nAgile Movement. Your movement doesn\'t provoke Opportunity Attacks.\n\nElegant Form. When you fail a Dexterity or Charisma check or a saving throw with any ability, you can add your Dance Die to the roll, potentially turning the failure into a success.\n\nRetaliatory Swipe. Whenever a creature within 5 feet of you hits you with a melee attack roll, the attacker takes damage equal to two rolls of your Dance Die. This damage is the same type dealt by a weapon you\'re holding or your Unarmed Strike.\n\nSpinning Shot. You can add your Dance Die to ranged attack rolls you make with weapons.'
    },
    {
      level: 2,
      name: 'Nimble Start',
      description: 'Attacks against you during the first round of combat have Disadvantage.'
    },
    {
      level: 3,
      name: 'Dancer Subclass',
      description: 'You gain a Dancer subclass of your choice. A subclass is a specialization that grants you features at certain Dancer levels. For the rest of your career, you gain each of your subclass\'s features that are of your Dancer level or lower.'
    },
    {
      level: 3,
      name: 'Fast Movement',
      description: 'Your Speed increases by 10 feet while you aren\'t wearing Heavy armor.'
    },
    {
      level: 4,
      name: 'Ability Score Improvement',
      description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at Dancer levels 8, 12, and 16.'
    },
    {
      level: 5,
      name: 'Extra Attack',
      description: 'You can attack twice instead of once whenever you take the Attack action on your turn.'
    },
    {
      level: 5,
      name: 'Three-Target Extra Attack',
      description: 'When you take the Attack action on your turn, you can attack three times if all of your attacks are against different targets.'
    },
    {
      level: 6,
      name: 'Subclass feature',
      description: 'You gain a feature from your Dancer subclass at this level.'
    },
    {
      level: 7,
      name: 'Evasion',
      description: 'You can nimbly dodge out of the way of certain dangers. When you\'re subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. You can\'t use this feature if you have the Incapacitated condition.'
    },
    {
      level: 8,
      name: 'Ability Score Improvement',
      description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.'
    },
    {
      level: 9,
      name: 'Heroic Dance',
      description: 'When you begin your Dance, you can give yourself Heroic Inspiration if you don\'t have it.'
    },
    {
      level: 10,
      name: 'Subclass feature',
      description: 'You gain a feature from your Dancer subclass at this level.'
    },
    {
      level: 11,
      name: 'Four-Target Extra Attack',
      description: 'When you take the Attack action on your turn, you can attack four times if all of your attacks are against different targets.'
    },
    {
      level: 11,
      name: 'Graceful Retaliation',
      description: 'When a creature you can see within 30 feet of yourself hits or misses you with an attack roll, you can take a Reaction to make one attack against that creature, using a weapon with the Light or Finesse property or an Unarmed Strike. Your attack follows the triggering attack and its effects.'
    },
    {
      level: 12,
      name: 'Ability Score Improvement',
      description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.'
    },
    {
      level: 13,
      name: 'Freestyle',
      description: 'When you begin your Dance, you can choose two Dance Styles instead of one. You can change one style at a time as a Bonus Action.'
    },
    {
      level: 14,
      name: 'Subclass feature',
      description: 'You gain a feature from your Dancer subclass at this level.'
    },
    {
      level: 15,
      name: 'Fierce Start',
      description: 'Whenever you deal damage to a creature with a weapon or Unarmed Strike on the first round of combat, you can add your Charisma modifier to the damage roll.'
    },
    {
      level: 16,
      name: 'Ability Score Improvement',
      description: 'You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.'
    },
    {
      level: 17,
      name: 'Five-Target Extra Attack',
      description: 'When you take the Attack action on your turn, you can attack five times if all of your attacks are against different targets.'
    },
    {
      level: 18,
      name: 'Invigorating Dance',
      description: 'When you begin your Dance, you gain Temporary Hit Points equal to your Dancer level plus your Charisma modifier (minimum of 1).'
    },
    {
      level: 19,
      name: 'Epic Boon',
      description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify.'
    },
    {
      level: 20,
      name: 'Grand Finale',
      description: 'When you take the Attack action while your Dance is active, you can perform a Grand Finale. Until the end of your turn, any attack you make that hits becomes a Critical Hit, and you can make two additional attacks as a Bonus Action. At the end of your turn, your Dance ends.\n\nYou can\'t use this feature on the first round of combat, and once you use this feature, you can\'t use it again until you finish a Long Rest. You can also restore your use of it by expending two uses of your Dance (no action required).'
    }
  ],

  // ===== Подклассы (субклассы) =====
  subclasses: [
    // ---- Acrobat ----
    {
      name: 'Acrobat',
      description: 'Strike with Gymnastic Speed and Momentum. Acrobats vault, walk tightropes, and backflip over their foes to find new angles of approach. Such Dancers often perform with circuses or work for criminal organizations, and find endless applications for their skills in dungeon-diving. Moreover, an Acrobat can convert the momentum of their gymnastics into crushing force when a foe proves otherwise intractable.',
      features: [
        {
          level: 3,
          name: 'Momentum',
          description: 'While your Dance is active, you gain Momentum when you leave an enemy\'s reach and each time you move 15 feet on your turn. When you hit a creature with a weapon or an Unarmed Strike, you can expend your Momentum to deal extra damage equal to one roll of your Dance Die. This damage is the same type dealt by the weapon.\n\nYou can have only one Momentum at a time. At the end of your turn, you lose any unexpended Momentum.'
        },
        {
          level: 3,
          name: 'Aerial Acrobat',
          description: 'Your superior gymnastic skill grants you the following benefits.\n\nCharismatic Acrobatics. You gain proficiency in the Acrobatics skill. Additionally, you gain a bonus to checks using this skill equal to your Charisma modifier (minimum bonus of +1).\n\nAerialist. You can determine your jump distance using your Dexterity rather than your Strength.\n\nClimber. You gain a Climb Speed equal to your Speed.'
        },
        {
          level: 6,
          name: 'Tumbling',
          description: 'While your Agile Movement Dance Style is active, you gain the following benefits.\n\nFall Safely. The first time you fall each turn, reduce any damage you take from the fall by an amount equal to five times your Dancer level.\n\nIgnore Difficult Terrain. Difficult Terrain doesn\'t cost you extra movement.\n\nSpeed Increase. Your Speed increases by 10 feet.'
        },
        {
          level: 10,
          name: 'Evasive Speed',
          description: 'When you move 30 feet or more during your turn, you can take the Dodge action as a Bonus Action.'
        },
        {
          level: 14,
          name: 'Deadly Momentum',
          description: 'You can have up to three Momentum at a time and you don\'t lose Momentum at the end of your turn while your Dance is active. When you hit a creature with a weapon or an Unarmed Strike, you can expend up to three Momentum at once.'
        }
      ]
    },

    // ---- Cheerleader ----
    {
      name: 'Cheerleader',
      description: 'Encourage Your Allies with Acrobatics and Cheer. Pom-pom-wielding Cheerleaders are an essential component of siegeball games, which sell out stadiums wherever teams clash. Cheerleaders bound from the sidelines, energizing the crowd and their team with upbeat chants and daring acrobatic displays. Indeed, on some siegeball teams, the most impressive athleticism occurs on the sidelines with human pyramids.',
      features: [
        {
          level: 3,
          name: 'Inspiring Chant (Dance Style)',
          description: 'A 10-foot Emanation of inspiration emanates from you. Whenever an ally in the Emanation fails a D20 Test, that ally can roll your Dance Die and add the number rolled to the D20, potentially turning the failure into a success. Once an ally rolls your Dance Die, it can\'t do so again until the start of your next turn.'
        },
        {
          level: 3,
          name: 'Team Player',
          description: 'Your contagious positivity grants you the following benefits.\n\nCheerful. You have Advantage on saving throws you make to avoid or end the Frightened condition.\n\nGo Team! When you take the Help action to assist an ally with a Strength (Athletics) or Dexterity (Acrobatics) check, that ally can add your Charisma modifier to its roll.'
        },
        {
          level: 6,
          name: 'Squad Warmup',
          description: 'When you begin your Dance, choose a Dance Style other than Inspiring Chant. Each ally that can see or hear you within 10 feet of yourself gains the benefits of that Dance Style until the start of your next turn.'
        },
        {
          level: 10,
          name: 'Athletic Dexterity',
          description: 'When you make a Strength or Constitution saving throw, you can make a Dexterity saving throw instead.'
        },
        {
          level: 14,
          name: 'Spirited Start',
          description: 'When you roll Initiative, you can give yourself and each ally that can see or hear you within 60 feet of yourself a special instance of Heroic Inspiration that vanishes after the first round of combat. A creature can have this instance of Heroic Inspiration and another instance at the same time, but can only use one Heroic Inspiration per roll.'
        }
      ]
    },

    // ---- Contortionist ----
    {
      name: 'Contortionist',
      description: 'Dance with Mesmerizing Flexibility. Balancing on their shoulders and folding their body into perplexing configurations, Contortionists represent the very pinnacle of flexibility. Contortionists, with practice, can leverage their flexibility to evade attacks and respond from unexpected directions with the grace and lethality of a serpent.',
      features: [
        {
          level: 3,
          name: 'Unnatural Grace',
          description: 'When you roll a 1 or 2 on a Dance Die on another creature\'s turn, you can take a Reaction to roll another Dance Die and add it to the roll.\n\nWhen you reach Dancer level 11, you can use this feature when you roll a 1–3 on a Dice Die.'
        },
        {
          level: 3,
          name: 'Double Joints',
          description: 'While your Dance is active, you have Immunity to the Grappled and Restrained conditions. Additionally, you can end the Prone condition on yourself without spending any movement.'
        },
        {
          level: 6,
          name: 'Backbend',
          description: 'You can enter the space of a Small or larger enemy and end your turn there. While in this creature\'s space, you have Half Cover against attacks and effects that originate outside of your space, and the creature can\'t have Advantage on attack rolls against you.'
        },
        {
          level: 10,
          name: 'Twisting Redirection',
          description: 'When a creature you can see misses you with a melee attack roll, you can take a Reaction to force the attack to target another creature other than the attacker within the attacker\'s reach. Use the existing attack roll against the new target\'s AC, dealing damage as normal on a hit.\n\nYou can take this Reaction a number of times equal to your Dexterity modifier (minimum of once). You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.'
        },
        {
          level: 14,
          name: 'Reactive',
          description: 'While your Dance is active, you have an additional Reaction, which you regain at the start of each of your turns. You can\'t take two Reactions on the same turn. Additionally, once you take a Reaction, such as an Opportunity Attack or casting a Spell with a Reaction trigger, you can\'t take that Reaction again until the start of your next turn.'
        }
      ]
    },

    // ---- Courtesan ----
    {
      name: 'Courtesan',
      description: 'Enthrall Others with Your Grace. Dressed in finery, Courtesans are the very picture of cultured elegance. Rather than dancing like a jester for others\' amusement, Courtesans leverage their unearthly grace to twist the affections of others. Most ingratiate themselves into high society, for a melodic tone and captivating glance is enough to enrapture most nobles.',
      features: [
        {
          level: 3,
          name: 'Enthralling Movement (Dance Style)',
          description: 'When you choose this Dance Style and at the start of each of your turns while this Dance Style is active, choose a creature that can see you within 30 feet of you to make a Wisdom saving throw (DC 8 plus your Charisma modifier and Proficiency Bonus). On a failed save, the target has the Charmed condition until the start of your next turn.'
        },
        {
          level: 3,
          name: 'Honeyed Words',
          description: 'Your eloquent speech grants you the following benefits.\n\nProficiency. You gain proficiency in the Deception and Persuasion skills.\n\nLanguages. You know two languages of your choice.'
        },
        {
          level: 6,
          name: 'Sociable Start',
          description: 'During the first round of combat, you can take the Influence action as a Bonus Action and have Advantage on ability checks you make using that action.'
        },
        {
          level: 10,
          name: 'Beguiling Charm',
          description: 'When you give a creature the Charmed condition, you can choose one of the following effects for the creature while it has the condition.\n\nBad Influence. The target subtracts your Dance Die from Intelligence, Wisdom, and Charisma saving throws it makes.\n\nFriend of My Friends. The target subtracts your Dance Die from all its attack rolls.'
        },
        {
          level: 14,
          name: 'Heartbreaker',
          description: 'Whenever a creature succeeds or fails its saving throw against your Enthralling Movement, you can deal Psychic damage to the target equal to two rolls of your Dance Die.'
        }
      ]
    },

    // ---- Danseur Macabre ----
    {
      name: 'Danseur Macabre',
      description: 'Raise the Dead with Your Necromantic Dance. The "Danse Macabre" is a lament, a dirge from the recently deceased that causes the spirits of the dead to stir and join in. The spectacle is one of grim frivolity—a single living person among jovial skeletons that vanish upon the danse\'s final note. Only a few Dancers called "Necrodancers" or "Danseurs Macabre" learn this morbid footwork. Usually, it calls for those with a morose disposition and a fascination with death, the very same attributes that make for a fine necromancer.',
      features: [
        {
          level: 3,
          name: 'Danse Macabre (Dance Style)',
          description: 'When you choose this Dance Style and as a Bonus Action on subsequent turns while this Dance Style is active, you can summon Skeleton Spirits in unoccupied spaces within a 30-foot Emanation. You can summon one or more Skeleton Spirits until the number of spirits equals your Charisma modifier (minimum of one). Each summoned skeleton spirit expends one of this feature\'s uses; it has a number of uses equal to your Dancer level plus your Charisma modifier. You regain all expended uses when you finish a Long Rest.\n\nThe spirits act during your turn. When you summon the spirits and as a Bonus Action on subsequent turns while this Dance Style is active, you can command each of your spirits to make an attack roll. The spirits move when you do to remain within the Emanation. Your spirits collectively share one Reaction, which a single spirit can take each round.\n\nWhen this Dance Style is no longer active, your skeleton spirits vanish.'
        },
        {
          level: 3,
          name: 'Ghoulish Calling',
          description: 'Your affinity for the Undead grants you the following benefits.\n\nDarkvision. You gain Darkvision with a range of 60 feet. If you already have Darkvision when you gain this feature, its range increases by 60 feet.\n\nNecrotic Resistance. You have Resistance to Necrotic damage.\n\nUndead Empathy. Whenever an Undead creature attacks you, it makes a Wisdom saving throw (DC 8 plus your Charisma modifier and Proficiency Bonus). On a failed save, its attack misses.'
        },
        {
          level: 6,
          name: 'Dance with the Dead',
          description: 'You can cast Speak with Dead without a spell slot. Charisma is your spellcasting ability for this spell. When you cast the spell in this way, the corpse gains enough of a semblance of life to move and dance with you for the duration of the spell, if it is able. The corpse will generally move where you ask it to, but can\'t take actions or deal damage. You can also take a Bonus Action to change the target of the spell to a different corpse within range. You can ask a total of five questions, no matter how many corpses you target.\n\nOnce you use this feature, you can\'t use it again until you finish a Short or Long Rest. You can also restore your use of it by expending a use of your Dance (no action required).'
        },
        {
          level: 10,
          name: 'Danse Fatale',
          description: 'Your Danse Macabre Dance Style improves in the following ways.\n\nAvoidance. If one of your skeleton spirits is subjected to an effect that allows it to make a saving throw to take only half damage, it instead takes no damage if it succeeds on the save and half damage if it fails. It can\'t use this trait if it has the Incapacitated condition.\n\nImproved Spectral Bolt. The damage of your skeleton spirits\' Spectral Bolt becomes 1d6 Necrotic damage.'
        },
        {
          level: 14,
          name: 'Grim Troupe',
          description: 'When a creature you can see within 60 feet dies while your Danse Macabre Dance Style is active, you can take a Reaction to cast Create Undead targeting that creature without expending a spell slot or components. The ghoul is under your control and uses the following rules.\n\nCharismatic Attacks. The ghoul\'s attack bonus equals your Charisma modifier plus your Proficiency Bonus.\n\nChoreographed Command. When you use the Bonus Action of your Danse Macabre Dance Style, you can command the ghouls animated by Create Undead as a part of the same Bonus Action.\n\nRhythmic Unlife. When your Danse Macabre Dance Style is no longer active, the ghoul dies.'
        }
      ]
    },

    // ---- Dramaturge ----
    {
      name: 'Dramaturge',
      description: 'Perform with Arcane Magic. Wearing extravagant costumes or archetypal masks of comedy and tragedy, Dramaturges channel the power of the stage into performative magic. Their spells manipulate minds and create illusions to bolster their performances, transforming the world around them into a great play in which they are the star.',
      features: [
        {
          level: 3,
          name: 'Spellcasting',
          description: 'You have learned to cast spells. The information below details how you use those rules as a Dramaturge.\n\nCantrips. You know two cantrips of your choice from the Bard spell list (see that class\'s section for its list). Minor Illusion and Vicious Mockery are recommended. Whenever you gain a Dancer level, you can replace one of these cantrips with another cantrip of your choice from the Bard spell list. When you reach Dancer level 10, you learn another Bard cantrip of your choice.\n\nSpell Slots. The Dramaturge Spellcasting table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest.\n\nPrepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose three level 1 spells from the Bard spell list. Cure Wounds, Hideous Laughter, and Silent Image are recommended. The number of spells on your list increases as you gain Dancer levels, as shown in the Prepared Spells column of the Dramaturge Spellcasting table. Whenever that number increases, choose additional spells from the Bard spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you\'re a level 7 Dancer, your list of prepared spells can include five Bard spells of levels 1 and 2 in any combination.\n\nChanging your Prepared Spells. Whenever you gain a Dancer level, you can replace one spell on your list with another Bard spell for which you have spell slots.\n\nSpellcasting Ability. Charisma is your spellcasting ability for your Bard spells.\n\nSpellcasting Focus. You can use a Disguise Kit as a Spellcasting Focus for your Bard spells.'
        },
        {
          level: 3,
          name: 'Thespian',
          description: 'Your theatrical talents grant you the following benefits.\n\nDisguise Kits. You gain proficiency with the Disguise Kit.\n\nDramatic Flair. Whenever you make a Charisma (Performance) check, add your Dance Die to the roll if you don\'t add it already.'
        },
        {
          level: 3,
          name: 'Spotlight (Dance Style)',
          description: 'Once on each of your turns, when a creature within 60 feet of you succeeds on a saving throw against one of your Bard spells while your Dance is active, you can magically create a spotlight that highlights this creature. Roll a Dance Die and subtract the number rolled from the creature\'s roll, potentially turning the success into a failure.'
        },
        {
          level: 6,
          name: 'Arcane Strike',
          description: 'When you take the Attack action on your turn, you can replace one of the attacks with a casting of one of your Bard cantrips that has a casting time of an action.'
        },
        {
          level: 10,
          name: 'Comedy and Tragedy',
          description: 'You have a pair of enchanted theater masks. You can put on either your Comedy Mask or your Tragedy Mask when you finish a Short or Long Rest, granting you the following benefits until you remove the mask or replace it with the other one.\n\nComedy Mask. Whenever an ally you can see or hear within 60 feet of yourself regains Hit Points or gains Temporary Hit Points, you can take a Reaction to regain the same number of Hit Points or gain the same number of Temporary Hit Points, respectively.\n\nTragedy Mask. When an ally you can see or hear within 60 feet of yourself takes damage that causes it to become Bloodied or drop to 0 Hit Points, you can take a Reaction to gain Resistance to the damage type the ally took until you finish a Short or Long Rest or use this benefit again.'
        },
        {
          level: 14,
          name: 'Encore',
          description: 'When you take the Attack action on your turn while your Dance is active, you can cast a spell that has a casting time of an action as a Bonus Action.\n\nOnce you use this feature, you can\'t use it again until you finish a Short or Long Rest. You can also restore your use of it by expending a use of your Dance (no action required).'
        }
      ]
    },

    // ---- Fencer ----
    {
      name: 'Fencer',
      description: 'Parry and Thrust with Lethal Poise. Postured, graceful, and utterly deadly, Fencers favor one-handed parries and thrusts to whirling Daggers and Darts. Their repertoire of movements constitute a dance of footwork and bladework that can overcome most foes with a few precise movements and pinpoint strikes.',
      features: [
        {
          level: 3,
          name: 'Dueling Stance (Dance Style)',
          description: 'When you\'re holding a Melee weapon in one hand and no other weapons, you can add one roll of your Dance Die to damage rolls with that weapon.'
        },
        {
          level: 3,
          name: 'Panache',
          description: 'You gain proficiency in the Persuasion skill. Additionally, you gain a bonus to checks using this skill equal to your Dexterity modifier (minimum bonus of +1).'
        },
        {
          level: 6,
          name: 'Fencing Maneuvers',
          description: 'While your Dance is active, you can perform the following maneuvers.\n\nDisarm. As a Bonus Action, you can attempt to disarm a creature you can see within 5 feet of you. The target makes a Strength saving throw (DC 8 plus your Dexterity modifier and Proficiency Bonus). On a failed save, it drops one item of your choice that it\'s holding. The object lands in a space you choose within 10 feet of the target.\n\nEn Garde. As a Bonus Action, you can goad an enemy that can see or hear you into attacking you. Until the start of your next turn, the enemy has Disadvantage on attack rolls against creatures other than you while it is within 5 feet of you. This effect ends early if your Dance ends.\n\nLunge. As a Bonus Action, you can increase your reach by 5 feet with weapons that lack the Two-Handed or Versatile properties until the start of your next turn. This effect ends early if your Dance ends.'
        },
        {
          level: 10,
          name: 'Parry and Riposte',
          description: 'When you use your Graceful Dodge, you can take a Reaction to add another roll of your Dance Die to your Armor Class for this attack.\n\nStarting at Dancer level 11, if you use this feature and the triggering attack misses you, you can use your Graceful Retaliation as a part of the same Reaction.\n\nYou can take this Reaction a number of times equal to your Dexterity modifier (minimum of once). You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.'
        },
        {
          level: 14,
          name: 'Superior Flourish',
          description: 'When you score a Critical Hit or reduce an enemy to 0 Hit Points on your turn, you regain up to 15 feet of expended movement and can make one additional attack on your turn. You can make up to three such additional attacks on a single turn.'
        }
      ]
    },

    // ---- Fey Ballerina ----
    {
      name: 'Fey Ballerina',
      description: 'Dance With Unearthly Grace and Perfection. Perhaps the most majestic style of dance originates in the Feywild, where unending waltzes and chaotic ballets intermingle with raw threads of magic. Mortal Fey Ballerinas have proven their merits at dance to a Fey and been bequeathed with a boon: a magical pair of slippers, a charm, or another trinket that further imbues their Dance with supernatural grace.',
      features: [
        {
          level: 3,
          name: 'Magic Slippers',
          description: 'A magical trinket from a Fey creature, such as a pair of magical slippers, grants you supernatural elegance. Difficult Terrain doesn\'t cost you extra movement.'
        },
        {
          level: 3,
          name: 'Perfectionist',
          description: 'Your enchanted striving for perfection grants you the following benefits.\n\nFlawless Footing. If you end your Dance and didn\'t take damage while your Dance was active, you regain the expended use of your Dance.\n\nOne Step Ahead. You gain a +1 bonus whenever you roll a Dance Die.'
        },
        {
          level: 6,
          name: 'Misty Waltz',
          description: 'You can cast Misty Step without expending a spell slot a number of times equal to your Charisma modifier (minimum of once). Charisma is your spellcasting modifier for this spell. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.'
        },
        {
          level: 10,
          name: 'Sublime Start',
          description: 'During the first round of combat, your Speed is doubled and you automatically succeed on saving throws.'
        },
        {
          level: 14,
          name: 'Swan Song',
          description: 'While you\'re Bloodied and your Dance is active, you can take a Bonus Action to begin a Swan Song. You regain Hit Points up to half your Hit Point maximum and you have Advantage on the first D20 Test you make each turn until your Dance ends.\n\nOnce you use this feature, you can\'t use it again until you finish a Long Rest.'
        }
      ]
    },

    // ---- Fire Dancer ----
    {
      name: 'Fire Dancer',
      description: 'Perform Dazzling Pyrotechnic Displays. Fire dancing features dazzling displays of torch juggling and spinning, fire eating, and fire breathing. Though these spark-throwing performances are a wonder to behold, they can easily become hazardous, unintentionally sparking a blaze or intentionally catching a foe alight.',
      features: [
        {
          level: 3,
          name: 'Pyrotechnics (Dance Style)',
          description: 'Your weapons, Unarmed Strikes, and Dancer features can deal Fire damage or its normal damage type. Whenever you deal Fire damage and roll the highest number on any damage die, you can roll that damage die again and add it to the damage, rolling again if it is the highest number, and so on. You can add a maximum number of dice to the damage roll equal to your Charisma modifier (minimum of 1).'
        },
        {
          level: 3,
          name: 'Flame Twirling',
          description: 'Your experience performing with flames grants you the following benefits.\n\nFire Resistance. You have Resistance to Fire damage.\n\nTorch Juggler. For you, a lit Torch is a weapon with the following statistics.\n\nWeapon Category: Simple Melee\nDamage on a Hit: 1d4 Fire plus the ability modifier used for the attack roll\nProperties: Light, Finesse, Thrown (range 20/60 feet)\nMastery: Nick or Vex (You can use either property with the weapon, but you can only use one mastery property on each attack. These properties don\'t count against the number of properties you can use with Weapon Mastery.)'
        },
        {
          level: 6,
          name: 'Fire Breather',
          description: 'As a Magic action, you can breathe flames in a 15-foot Cone. Each creature in the Cone makes a Dexterity saving throw (DC 8 plus your Charisma modifier and Proficiency Bonus). On a failed save, a creature takes Fire damage equal to three rolls of your Dance Die plus your Dancer level. On a successful save, a creature takes half as much damage.\n\nOnce you use this feature, you can\'t use it again until you finish a Short or Long Rest. You can also restore your use of it by expending a use of your Dance (no action required).'
        },
        {
          level: 10,
          name: 'Blinding Flare',
          description: 'Once on each of your turns while your Pyrotechnics Dance Style is active, when you deal damage to a creature and roll the highest number on a damage die, that target makes a Constitution saving throw (DC 8 plus your Charisma modifier and Proficiency Bonus). On a failed save, the target has the Blinded condition until the start of your next turn.'
        },
        {
          level: 14,
          name: 'Inferno Breath',
          description: 'Your Fire Breather feature improves in the following ways.\n\nIgnore Resistance. The damage you deal with this feature ignores Resistance to Fire damage.\n\nImproved Cone. You can breathe flames in a 30-foot Cone.\n\nBurning. Each creature that fails its saving throw starts Burning. The creature takes Fire damage at the start of each of its turns equal to one roll of your Dance Die. As an action, a creature can extinguish fire on itself by giving itself the Prone condition and rolling on the ground. The fire also goes out if it is doused, submerged, or suffocated.'
        }
      ]
    },

    // ---- Harlequin ----
    {
      name: 'Harlequin',
      description: 'Mock Your Foes with Acrobatic Flair. Consummate comedians, jugglers, and acrobats, Harlequins perform alongside jesters in royal courts and local taverns alike. Their usual performances feature a mix of barbed jokes at the attendees and daring knife stunts performed with an acrobatic flair. Though they draw plenty of ire from their heckling routine, their nastiest jokes can reliably earn a laugh from the crowd and take down the target a peg or two.',
      features: [
        {
          level: 3,
          name: 'Jest (Dance Style)',
          description: 'When you choose this Dance Style and as a Bonus Action on subsequent turns while this Dance Style is active, you can choose a creature within 15 feet of yourself to mock. If the target can hear you (though it need not understand you), it has Disadvantage on the next attack roll it makes against a creature other than you before the end of its next turn.'
        },
        {
          level: 3,
          name: 'Dagger Juggling',
          description: 'You\'ve mastered the trick of juggling weapons foes, granting you the following benefits.\n\nJuggling. Whenever you draw a weapon, you can begin to juggle a number of weapons with the Thrown property up to your Dexterity modifier (minimum of two). You count as holding all of these weapons. Attacking at long range doesn\'t impose Disadvantage on your attacks with weapons you are juggling.\n\nPapercut. Whenever you roll a 1 on any damage die, you treat that result as the highest number on that die instead.'
        },
        {
          level: 6,
          name: 'Backflip',
          description: 'When you roll a Dance Die, you can flip the die over and use the number on the bottom. Note that for a balanced die, the top and bottom numbers add up to one more than the die\'s largest number. Once you use this feature, you can\'t use it again until the start of your next turn.\n\nYou can use this feature a number of times equal to your Dexterity modifier (minimum of once). You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.'
        },
        {
          level: 10,
          name: 'Vexing Jest',
          description: 'Your Jest Dance Style improves in the following ways.\n\nLosing Streak. Whenever the target of your Jest misses with an attack roll, it has Disadvantage on the next attack roll it makes before the start of your next turn.\n\nMocking Misfortune. Until the start of your next turn, whenever the target of your Jest rolls a 20 on the d20 of a D20 Test, the roll instead becomes a 1.'
        },
        {
          level: 14,
          name: 'Deft Fling',
          description: 'Once on each of your turns when you miss a target with an attack roll, you can make one ranged attack with a weapon you are juggling against the same target.'
        }
      ]
    },

    // ---- Marionettist ----
    {
      name: 'Marionettist',
      description: 'Manipulate Others Like Puppets. Marionettists are master manipulators with magical strings. Instead of dancing themselves, they prefer to control a puppet or ensnare other creatures with their strings and compel them to dance to a new rhythm.',
      features: [
        {
          level: 3,
          name: 'Familiar Doll',
          description: 'You can cast the Find Familiar spell but only as a Ritual. Charisma is your spellcasting ability for this spell. When you cast the spell in this way, the familiar is a Construct and resembles a puppet or marionette of your choice.'
        },
        {
          level: 3,
          name: 'Puppet Strings (Dance Style)',
          description: 'When you choose this Dance Style and as a Bonus Action on subsequent turns while this Dance Style is active, choose a creature that can see you within 30 feet of you to make a Wisdom saving throw (DC 8 plus your Charisma modifier and Proficiency Bonus). On a failed save, the target must immediately take its Reaction, if available, to make a melee attack against a creature other than itself that you mentally choose. If no creature is within the target\'s reach, its Reaction is wasted.'
        },
        {
          level: 6,
          name: 'Manipulator',
          description: 'Your skill in manipulating others grants you the following benefits.\n\nStringed Suggestion. You can cast Suggestion as a Bonus Action without a spell slot. Charisma is your spellcasting modifier for this spell. Once you cast the spell in this way, you can\'t use it again until you finish a Long Rest. You can also restore your use of it by expending a use of your Dance (no action required).\n\nTangle of Lies. Whenever you make a Charisma (Deception) check, add your Dance Die to the roll if you don\'t add it already.'
        },
        {
          level: 10,
          name: 'Heartstrings',
          description: 'When a creature fails its saving throw against your Puppet Strings, it has the Charmed condition and Disadvantage on attack rolls against your allies until the start of your next turn.'
        },
        {
          level: 14,
          name: 'Master of Puppets',
          description: 'When a Beast or Humanoid fails its saving throw against your Puppet Strings, you can cast Dominate Beast or Dominate Person targeting the creature, respectively, without a spell slot. The target automatically fails its saving throw against the spell. Charisma is your spellcasting modifier for this feature\'s spells.\n\nThe spell ends early if your Puppet Strings is no longer active. Additionally, you can\'t use the Bonus Action of your Puppet Strings for the spell\'s duration.\n\nWhen you reach Dancer level 15, you can use this feature to cast Dominate Monster when any creature fails its saving throw against Puppet Strings.\n\nOnce you use this feature to cast a spell, you can\'t do so again until you finish a Long Rest. You can also restore your use of this feature to cast Dominate Beast or Dominate Person by expending two uses of your Dance (no action required).'
        }
      ]
    },

    // ---- Mime ----
    {
      name: 'Mime',
      description: 'Perform a Silent Dance with Invisible Props. Silent and monochromatic performers, Mimes act out a world of invisible objects and wordless gags. Those that master this artform find that their pantomimes can drive sound from the room, imbue invisible props with solidity, and even raise invisible walls of force around their foes.',
      features: [
        {
          level: 3,
          name: 'Pantomime (Dance Style)',
          description: 'You become magically silent and objects you are holding become Invisible. You have Advantage on the first melee attack roll you make on each of your turns.'
        },
        {
          level: 3,
          name: 'Silent Routine',
          description: 'Your practice performing silently grants you the following benefits.\n\nMimed Communication. You can silently communicate any sentence of 10 words or fewer to a creature that can see you and understands at least one language.\n\nSly. You gain proficiency in the Stealth or Sleight of Hand skill.'
        },
        {
          level: 6,
          name: 'Unseen Impact',
          description: 'Once on each of your turns, when you hit a creature with a melee attack while your Pantomime Dance Style is active, you can give the target the Prone condition or push it up to 10 feet away from you.'
        },
        {
          level: 10,
          name: 'Invisible Wall',
          description: 'You can cast Wall of Force without expending a spell slot or spell components. Charisma is your spellcasting ability for this spell.\n\nOnce you use this feature, you can\'t use it again until you finish a Long Rest. You can also restore your use of it by expending two uses of your Dance (no action required).'
        },
        {
          level: 14,
          name: 'Mystical Maul',
          description: 'While your Pantomime Dance Style is active, whenever you roll damage with a Melee weapon that deals 1d4 or 1d6 damage, you can deal 2d6 Force damage instead of its normal damage type.'
        }
      ]
    },

    // ---- Moonwalker ----
    {
      name: 'Moonwalker',
      description: 'Weightlessly Dance Through the Air. With a stylish pair of anti-gravity shoes, Moonwalkers perform a weightless Dance that defies all manner of physics. Their signature move drifts backwards, sideways, and through the air in frictionless and spellbinding style.',
      features: [
        {
          level: 3,
          name: 'Zero-G Kicks',
          description: 'You have a pair of stylish shoes that defy gravity and grant you the following benefits.\n\nAnti-Gravity Slide. When an enemy you can see misses you with a Melee attack, you can take a Reaction to move 10 feet without provoking Opportunity Attacks.\n\nFeather Fall. You can cast Feather Fall on yourself without expending a spell slot. Charisma is your spellcasting modifier for this spell.'
        },
        {
          level: 3,
          name: 'Moonwalk (Dance Style)',
          description: 'On your turn, you have a Fly Speed equal to your Speed if you aren\'t wearing Heavy armor. If you are still aloft at the end of your turn, you descend at a rate of 30 feet per round until you land unless you can stop the fall.'
        },
        {
          level: 6,
          name: 'Frictionless Field',
          description: 'You radiate an invisible aura that alters friction in a 10-foot Emanation originating from you. Within the Emanation, creatures you choose other than yourself can move without expending movement. Any other creature other than yourself treats the Emanation as Difficult Terrain. You can dismiss the Emanation or manifest it again as a Bonus Action.'
        },
        {
          level: 10,
          name: 'Slick Moves',
          description: 'You can cast Freedom of Movement on yourself without expending a spell slot. Charisma is your spellcasting modifier for this spell.'
        },
        {
          level: 14,
          name: 'Ethereal Moonwalk',
          description: 'Your Moonwalk has become a supernatural staple of your Dance routine, granting you the following benefits.\n\nPerpetual Moonwalk. While your Moonwalk Dance Style is active, you have a Fly Speed equal to your Speed. This Fly Speed doesn\'t end at the end of your turn.\n\nIncorporated Groove. When you choose the Moonwalk Dance Style, you become an ethereal blur of disco lights. You have Resistance to all damage and can move through occupied spaces as if they were Difficult Terrain. If you end your turn in such a space, you are shunted to the last unoccupied space you were in. After you take damage, you lose these benefits until the start of your next turn while this Dance Style is active.'
        }
      ]
    },

    // ---- Shadow Dancer ----
    {
      name: 'Shadow Dancer',
      description: 'Dance Alongside a Shadowy Duplicate. Wielding long-forgotten magic, Shadow Dancers animate their shadows to act as dance partners. This Shadowdance is a waltz performed in perfect synchronicity that can fold the darkness around them, obscuring the room or even causing the Dancer to vanish from view.',
      features: [
        {
          level: 3,
          name: 'Nocturnal',
          description: 'Your eyes are magically suited to darkness, granting you the following benefits.\n\nCharismatic Stealth. You gain proficiency in the Stealth skill. Additionally, you gain a bonus to checks using this skill equal to your Charisma modifier (minimum bonus of +1).\n\nDarkvision. You gain Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet.'
        },
        {
          level: 3,
          name: 'Shadowdance',
          description: 'When you begin your Dance, you can choose to replace the Graceful Dodge benefit with Shadowdance.\n\nShadowdance. You create a shadowy duplicate of yourself which dances alongside you in your space. When a creature hits you with an attack roll while your duplicate remains, roll your Dance Die. If it rolls a 3 or higher, the duplicate is hit instead of you and the duplicate is destroyed. A creature is unaffected by this feature if it has the Blinded condition, Blindlight, or Truesight.\n\nThe duplicate vanishes when this Dance is no longer active. Your duplicate reappears at the start of each of your turns.'
        },
        {
          level: 6,
          name: 'Shrouded Start',
          description: 'On the first round of combat, you have the Invisible condition. The condition ends early immediately after you make an attack roll, deal damage, or cast a spell.'
        },
        {
          level: 10,
          name: 'Umbral Escape',
          description: 'When the shadow duplicate of your Shadowdance is destroyed, you can take a Reaction to teleport up to 60 feet to an unoccupied space you can see that is entirely in Dim Light or Darkness.'
        },
        {
          level: 14,
          name: 'Vengeful Shadow',
          description: 'When a creature destroys the shadow duplicate of your Shadowdance, lingering shadowstuff covers the creature until the end of your next turn. You have Advantage on attacks against a creature covered in shadowstuff, and whenever you hit such a creature with an attack, you deal an extra 1d6 Necrotic damage to it.'
        }
      ]
    },

    // ---- Steelsinger ----
    {
      name: 'Steelsinger',
      description: 'Deflect Attacks with Your Armored Dance. The "Steel Song" is a treatise on combat, detailing the stances and techniques of armed battle. Though the original manual has long since been lost to time, its practitioners have passed down the discipline down through the generations to particularly lightfooted warriors. Steelsingers demonstrate acrobatic flourishes and mobility, even while laden with relatively bulky weapons and armor, dancing across the battlefield in a lethal cadence.',
      features: [
        {
          level: 3,
          name: 'Steelsing Discipline',
          description: 'Your practice with the Steel song technique grants you the following benefits.\n\nCharismatic Athletics. You gain proficiency in the Athletics skill. Additionally, you gain a bonus to checks using this skill equal to your Charisma modifier (minimum bonus of +1).\n\nDefense. You gain the Defense Fighting Style feat.\n\nMartial Training. You gain proficiency with Martial weapons and training with Medium armor and Shields.'
        },
        {
          level: 3,
          name: 'Deflection (Dance Style)',
          description: 'Whenever you\'re hit by an attack while your Dance is active and you\'re holding a Shield or a Simple or Martial weapon, any Bludgeoning, Piercing, and Slashing damage dealt to you by that attack is reduced by one roll of your Dance Die.'
        },
        {
          level: 6,
          name: 'Armored Redirection',
          description: 'When a creature you can see hits an ally within 5 feet of you with an attack roll, you can take a Reaction to force the attack to target you instead. If the attack roll equals or exceeds your AC, the attack hits you instead; otherwise, it misses.\n\nOnce you use this feature, you can\'t use it again until you finish a Short or Long Rest or begin your Dance.'
        },
        {
          level: 10,
          name: 'Improved Armored Deflection',
          description: 'Your Deflection Dance Style is improved in the following ways.\n\nImproved Deflection. You can treat any roll of 1-3 on a Dance Die for your Deflection die as a 4.\n\nPrismatic Deflection. Acid, Cold, Fire, Lightning, Poison, and Thunder damage you take is also reduced. If an attack deals one of these damage types and Bludgeoning, Piercing, or Slashing damage, each damage type is reduced separately.'
        },
        {
          level: 14,
          name: 'Retaliatory Slam',
          description: 'You can use your Armored Redirection and Graceful Retaliation as a part of the same Reaction. When you do so, the target takes extra Bludgeoning damage equal to two rolls of your Dance Die on a hit.'
        }
      ]
    }
  ]
},
{
  "id": "necromancer",
  "name": "Некромант(WIP)",
  "description": "Некромант — полный заклинатель, повелевающий мёртвой плотью. Он не просто создаёт нежить: он выстраивает постоянный отряд прислужников, параметры которых зависят от того, чей труп поднят и в какой форме.\n\nКласс балансирует между боевым контролем, тактическим управлением миньонами и нарративным взаимодействием со смертью.",
  "image": "/images/necromancer.jpg",
  
  "primary_ability": "Интеллект",
  "saving_throws": ["Интеллект", "Мудрость"],
  "hit_die": "к8",
  
  "proficiencies": {
    "armor": ["Лёгкие доспехи"],
    "weapons": ["Простое оружие"],
    "tools": ["Набор травника"],
    "saving_throws": ["Интеллект", "Мудрость"],
    "skills": {
      "choices": 2,
      "options": ["Медицина", "История", "Магия", "Расследование", "Религия", "Обман"]
    }
  },
  
  "equipment": "Выберите одно: (а) арбалет и 20 болтов, или (б) любой простой оружие. (а) мешочек с компонентами или (б) тайный фокус. (а) набор исследователя или (б) набор священника. Кожаный доспех, простое оружие (кинжал), набор травника.",
  
  "features": [
    {
      "level": 1,
      "name": "Заклинательность",
      "description": "Вы — полный заклинатель, использующий Интеллект. Подготовка заклинаний = модификатор Интеллекта + уровень некроманта. Заклинания школы Некромантии готовятся сверх лимита бесплатно. Используйте таблицу полного кастера для ячеек."
    },
    {
      "level": 1,
      "name": "Поднятие Прислужника",
      "description": "Действием, потратив слот 1-го круга, вы касаетесь трупа (КР ≤ 1) и поднимаете его как Зомби, Скелет или Дух (ритуал 1 минута). Прислужник существует бессрочно. Командование — бонусное действие. Количество постоянных прислужников: 1 на 1-м, 2 на 9-м, 3 на 13-м, 4 на 17-м."
    },
    {
      "level": 2,
      "name": "Мёртвый Саквояж",
      "description": "Вы создаёте магическое хранилище для трупов (время для них остановлено). Вместимость: 3 трупа КР ≤ 1 (2 ур.), 5 трупов КР ≤ 2 (6 ур.), 7 трупов КР ≤ 4 (10 ур.), 10 трупов КР ≤ 6 (14 ур.). Труп можно извлечь действием."
    },
    {
      "level": 2,
      "name": "Починка Нежити",
      "description": "Бонусным действием и тратой слота вы восстанавливаете прислужнику 2к8 + мод. Интеллекта хитов за круг слота. На 5+ круге также снимает одно состояние. Альтернатива: во время короткого отдыха вернуть все хиты без слота (1 раз)."
    },
    {
      "level": 3,
      "name": "Некромантическая Традиция",
      "description": "Вы выбираете одну из шести традиций: Путь Плоти, Путь Кости, Путь Духа, Путь Лича, Путь Гниения или Путь Тёмного Пакта. Некоторые традиции меняют вашу заклинательную характеристику."
    },
    {
      "level": 4,
      "name": "Увеличение характеристик",
      "description": "Вы можете увеличить одну характеристику на 2 или две на 1. Максимум 20. Вместо этого можно взять черту."
    },
    {
      "level": 5,
      "name": "Усиленные Прислужники",
      "description": "Максимальный КР существа, чей труп можно поднять: КР 2 (5 ур.), КР 4 (9 ур.), КР 6 (13 ур.), КР 8 (17 ур.)."
    },
    {
      "level": 7,
      "name": "Шёпот Могилы",
      "description": "Вы можете задать трупу (умер не более 10 лет назад) три вопроса без траты слота. Труп обязан ответить, но не обязан говорить правду. Поднятая нежить не отвечает. 1/короткий отдых."
    },
    {
      "level": 8,
      "name": "Увеличение характеристик",
      "description": "Вы можете увеличить одну характеристику на 2 или две на 1. Максимум 20. Вместо этого можно взять черту."
    },
    {
      "level": 9,
      "name": "Второй Прислужник",
      "description": "Вы можете поддерживать до двух постоянных прислужников одновременно."
    },
    {
      "level": 10,
      "name": "Великое Воскрешение",
      "description": "Раз в день, вместо всех текущих прислужников (они рассыпаются), вы поднимаете одно существо КР ≤ (уровень/2) в любой форме. Оно существует 1 минуту на уровень, затем рассыпается. После использования нельзя поднимать прислужников до длинного отдыха."
    },
    {
      "level": 12,
      "name": "Увеличение характеристик",
      "description": "Вы можете увеличить одну характеристику на 2 или две на 1. Максимум 20. Вместо этого можно взять черту."
    },
    {
      "level": 13,
      "name": "Третий Прислужник",
      "description": "Вы можете поддерживать до трёх постоянных прислужников одновременно."
    },
    {
      "level": 15,
      "name": "Чувство Смерти",
      "description": "Вы пассивно ощущаете: причину и время смерти любого трупа в 30 футах; присутствие нежити в 60 футах (направление, КР); когда существо в 30 футах находится в 1 хите или умирает."
    },
    {
      "level": 16,
      "name": "Увеличение характеристик",
      "description": "Вы можете увеличить одну характеристику на 2 или две на 1. Максимум 20. Вместо этого можно взять черту."
    },
    {
      "level": 17,
      "name": "Четвёртый Прислужник",
      "description": "Вы можете поддерживать до четырёх постоянных прислужников одновременно."
    },
    {
      "level": 19,
      "name": "Увеличение характеристик",
      "description": "Вы можете увеличить одну характеристику на 2 или две на 1. Максимум 20. Вместо этого можно взять черту."
    },
    {
      "level": 20,
      "name": "Владыка Смерти",
      "description": "Выберите: Легион (6 постоянных прислужников) или Аватар Смерти (Великое Воскрешение 3/день, поднятое существо не рассыпается, пока вы не отзовёте)."
    }
  ],
  
  "subclasses": [
    {
      "name": "Путь Плоти",
      "description": "Некромант-хирург, видящий тело как механизм. Его зомби — не гниющие марионетки, а сшитые, усиленные, почти живые конструкты из мяса. Использует Мудрость для способностей подкласса.",
      "features": [
        {
          "level": 3,
          "name": "Живой щит",
          "description": "Зомби-прислужник может реакцией принять на себя атаку, нацеленную на вас в радиусе 5 фт. Зомби получает половину урона, вы — ноль. На 10-м ур. зомби получает полный урон."
        },
        {
          "level": 3,
          "name": "Сшивание",
          "description": "При поднятии зомби можно пришить часть другого трупа, давая +1 к физической характеристике. Максимум пришивок: 1 (3 ур.), 2 (6 ур.), 3 (10 ур.), 4 (14 ур.). С 3+ пришивками размер +1 категория."
        },
        {
          "level": 6,
          "name": "Мясной таран",
          "description": "Когда зомби атакует, бонусным действием заставьте цель пройти спасбросок Силы (Сл = 8 + Муд + мастерство). Провал: оттолкнута на 10 фт и сбита. Успех: только оттолкнута. 1/ход."
        },
        {
          "level": 10,
          "name": "Гнилая регенерация",
          "description": "Каждый зомби восстанавливает 5 + мод. Мудрости хитов в начале хода. При 0 хит 'впадает в спячку' и восстанавливается до половины через 1к4 раунда (1/длинный отдых)."
        },
        {
          "level": 14,
          "name": "Колосс из плоти",
          "description": "Действием объедините 2-4 зомби в Колосса на 1 минуту: HP суммируются, размер +1 за каждые 2 зомби, мультиатака (1 удар за каждого), скорость 20 фт. После расформирования зомби возвращаются с 1 хитом. 1/длинный отдых."
        },
        {
          "level": 18,
          "name": "Бессмертная плоть",
          "description": "Зомби получают иммунитет к испуган, очарован, парализован. При уничтожении тело не рассыпается: за 1 минуту пересоберите его (слот 3-го круга), зомби вернётся с половиной хитов."
        }
      ]
    },
    {
      "name": "Путь Кости",
      "description": "Тактик-архивариус. Его скелеты — не безмозглые марионетки, а солдаты, сохраняющие выучку, рефлексы и боевой опыт. Использует Интеллект для способностей подкласса.",
      "features": [
        {
          "level": 3,
          "name": "Боевая память",
          "description": "Скелет сохраняет одну боевую способность оригинала: Extra Attack, Sneak Attack 2к6, Martial Arts, Fighting Style или аналог. На 10-м ур. можно выбрать вторую способность."
        },
        {
          "level": 3,
          "name": "Костяная стойка",
          "description": "Бонусным действием скелет принимает защитную позицию: +3 КД и преимущество на спасброски Ловкости до начала вашего следующего хода. Скелет не может атаковать в этот ход."
        },
        {
          "level": 6,
          "name": "Координация",
          "description": "Если два или более ваших скелета атакуют одну цель в один ход, второй (и каждый последующий) получает преимущество на бросок атаки."
        },
        {
          "level": 10,
          "name": "Костяной доспех",
          "description": "Все ваши скелеты получают сопротивление колющему и режущему урону. Уязвимость к дробящему заменяется на обычный урон."
        },
        {
          "level": 14,
          "name": "Легион тактики",
          "description": "Все скелеты действуют на вашей инициативе. Раз в ход бесплатно перенаправьте атаку скелета. Скелеты получают +1 КД за каждого другого вашего скелета в 5 фт (максимум +3)."
        },
        {
          "level": 18,
          "name": "Костяная цитадель",
          "description": "Действием скелеты сцепляются в конструкцию на 1 минуту (КД 18, HP = сумма, до 4 клеток 5×5 фт, сопротивление физическому). Скелеты не атакуют, но вы получаете полное укрытие. 1/длинный отдых."
        }
      ]
    },
    {
      "name": "Путь Духа",
      "description": "Повелитель душ, удерживающий сознание мёртвых силой личности. Его духи — советники, шпионы, заклинатели. Использует Харизму для способностей подкласса.",
      "features": [
        {
          "level": 3,
          "name": "Голос за гранью",
          "description": "Дух обретает полноценную речь, может читать, писать, взаимодействовать с предметами (вес ≤ 5 фунтов). Сохраняет все языки, знания и воспоминания. Телепатическая связь до 1 мили."
        },
        {
          "level": 3,
          "name": "Призрачное заклинание",
          "description": "Дух может разыгрывать заклинания оригинала (круг ≤ ⌈КР/2⌉). Лимит: 2/день (3 ур.), 3/день (10 ур.). Бонус заклинания = Харизма + мастерство."
        },
        {
          "level": 6,
          "name": "Воля некроманта",
          "description": "Действием заставьте духа разыграть заклинание за вас, используя вашу ячейку. Дух служит 'живым фокусом': дальность и точка происхождения считаются от духа (в 60 фт)."
        },
        {
          "level": 10,
          "name": "Бестелесный шпион",
          "description": "Дух получает: невидимость на 1 минуту (бонусное действие, 1/короткий отдых); скорость полёта 40 фт; может проходить сквозь существ и объекты до 5 фт."
        },
        {
          "level": 14,
          "name": "Одержимость",
          "description": "Дух может вселиться в живое существо (спасбросок Харизмы). При успехе: вы видите/слышите через носителя, разыгрываете заклинания с его позиции, носитель получает помеху. Концентрация, до 10 мин. 1/длинный отдых на дух."
        },
        {
          "level": 18,
          "name": "Хор мёртвых",
          "description": "Объедините до 3 духов в Хор на 1 минуту (концентрация): разыгрывает заклинания любого духа без их лимита (тратит ваши ячейки), преимущество на спасброски, 3 атаки, КД 20. 1/длинный отдых."
        }
      ]
    },
    {
      "name": "Путь Лича",
      "description": "Некромант, обращающий магию смерти на себя. Миньоны отходят на второй план; цель — личное бессмертие и абсолютная магическая мощь. Использует Интеллект для способностей подкласса.",
      "features": [
        {
          "level": 3,
          "name": "Филактерия",
          "description": "Создайте предмет-якорь (КД 20, 50 хит). При 0 хит вы рассыпаетесь и восстанавливаетесь рядом с филактерией через 1к4 раунда с 1 хитом. 1/день. Если уничтожена — теряете черту (7 дней на новую)."
        },
        {
          "level": 3,
          "name": "Мёртвая плоть",
          "description": "Сопротивление некротическому урону; иммунитет к яду и болезням; не нуждаетесь в еде, воде, дыхании; не стареете."
        },
        {
          "level": 6,
          "name": "Некротический всплеск",
          "description": "При убийстве существа заклинанием получаете временные хиты = круг × 3. Если 5+ круг — восстанавливаете 1 ячейку на 1 круг ниже (1/длинный отдых)."
        },
        {
          "level": 10,
          "name": "Аура разложения",
          "description": "Существа в 10 фт (кроме союзников и нежити) получают 2к6 некротического урона в начале хода (спасбросок Тел — половина). Можно подавить/активировать бонусным действием."
        },
        {
          "level": 14,
          "name": "Поглощение жизни",
          "description": "Раз в ход при нанесении некротического урона заклинанием восстанавливаете хиты = половина урона (максимум 20)."
        },
        {
          "level": 18,
          "name": "Истинное бессмертие",
          "description": "Филактерия неуязвима (кроме вашего желания). При 0 хит рассыпаетесь и восстанавливаетесь через 1 раунд (без лимита). Иммунитет к урону от заклинаний 1-2 круга. Аура 20 фт, 3к6."
        }
      ]
    },
    {
      "name": "Путь Гниения",
      "description": "Некромант, видящий разложение как часть природного цикла. Магия — грибы, корни, насекомые, чёрнозем. Заклинательная характеристика меняется на Мудрость. Доступ к заклинаниям Друида школы Некромантии и Вызова.",
      "features": [
        {
          "level": 3,
          "name": "Смена характеристики",
          "description": "Ваша заклинательная характеристика меняется с Интеллекта на Мудрость. Вы получаете доступ к заклинаниям Друида школы Некромантии и Вызова."
        },
        {
          "level": 3,
          "name": "Грибница",
          "description": "При поднятии прислужника выберите Дар Гниения: Споровый панцирь (+2 КД, атакующий получает 1к4 яда), Корневая хватка (скорость цели -10 фт), Мицелиевая сеть (слепое зрение 30 фт), Рой (+1к6 яда 1/ход)."
        },
        {
          "level": 3,
          "name": "Удобрение",
          "description": "При уничтожении прислужника его тело разлагается (радиус 10 фт, 1 час). Союзники восстанавливают 1к4 хитов в начале хода. Действием: вырастить шипы (1к4+Мудрость, 1к8 колющего)."
        },
        {
          "level": 6,
          "name": "Спора-командир",
          "description": "Бонусным действием облако спор (конус 15 фт). Спасбросок Мудрости. Провал: очарован на 1 раунд, не может атаковать прислужников. 1/короткий отдых."
        },
        {
          "level": 10,
          "name": "Симбиоз",
          "description": "Действием впустите зомби или скелета в своё тело: получаете половину его хит как временные, один Дар Гниения. Прислужник восстанавливает хиты. Выпустить бонусным действием."
        },
        {
          "level": 14,
          "name": "Лес мёртвых",
          "description": "Действием (радиус 30 фт): враги проходят спасбросок Ловкости. Провал: опутан на 1 раунд. Одновременно поднимите до 3 трупов как зомби без слота (1 минута). 1/длинный отдых."
        },
        {
          "level": 18,
          "name": "Вечный цикл",
          "description": "Прислужники получают иммунитет к отравлен и сопротивление яду. При смерти союзника в 30 фт реакцией прорастите зомби (1 час, без слота). 1/короткий отдых можно сменить хар-ку на Int для заклинания."
        }
      ]
    },
    {
      "name": "Путь Тёмного Пакта",
      "description": "Некромант, получивший дар через пакт с сущностью за гранью. Магия инстинктивна, эмоциональна, опасна. Заклинательная характеристика меняется на Харизму. Получает Теневое Зрение 60 фт.",
      "features": [
        {
          "level": 3,
          "name": "Смена характеристики",
          "description": "Ваша заклинательная характеристика меняется с Интеллекта на Харизму. Вы получаете Теневое Зрение 60 фт и владение одним инструментом (карты Таро, кости, инструмент)."
        },
        {
          "level": 3,
          "name": "Покровитель Смерти",
          "description": "Выберите покровителя: Архилич (+1 атака некромантии, игнор сопротивления некротическому), Бог Забвения (реакцией восстановить ячейку при смерти в 30 фт, 1/длинный), Древний Вампир (1к4+Хар хит при попадании, 1/ход), Тень Бездны (тень 1 мин, 1/короткий)."
        },
        {
          "level": 3,
          "name": "Кровавый Обмен",
          "description": "Тратьте хиты вместо ячеек: 5=1кр, 12=2кр, 20=3кр, 30=4кр, 42=5кр, 56=6кр, 72=7кр, 90=8кр, 110=9кр. Не ниже 1 хита. Восстановление только длинным отдыхом."
        },
        {
          "level": 6,
          "name": "Метка Могилы",
          "description": "Бонусным действием проклятие (спасбросок Хар). На 1 минуту: уязвимость к некротическому, преимущество прислужников. При смерти — реакцией поднять как духа (1 час). 1/короткий отдых (2/короткий на 14 ур.)."
        },
        {
          "level": 10,
          "name": "Жертвенный Круг",
          "description": "Действием круг крови 20 фт (концентрация, 1 мин): прислужники +5 хит/ход, враги -2 к спасброскам, реакцией передавайте 1к6 хит. По окончании: временные хиты = 5 × раундов (макс 50). 1/длинный отдых."
        },
        {
          "level": 14,
          "name": "Поглощение Души",
          "description": "При убийстве существа (50+ HP) заклинанием/атакой: временные хиты = КР × 5, на 1 минуту получите одну способность существа (сопротивление, полёт, тёмное зрение, преимущество). 1/длинный отдых (2/длинный на 18 ур.)."
        },
        {
          "level": 18,
          "name": "Истинный Пакт",
          "description": "Улучшение покровителя: Архилич (фобос 30 фт, спас Мудр или испуган 1 мин), Бог Забвения (игнор иммунитета к некротическому 5+ круг), Древний Вампир (полёт 40, сопротивление некротике, 2к4+Хар), Тень Бездны (телепорт 60 бонусным, 10 мин форма)."
        }
      ]
    }
  ],
  "multiclass_requirements": "Интеллект 13",
  "multiclass_proficiencies": "Лёгкие доспехи, Набор травника",
  
  "tables": [
    {
      "title":"Таблица класса",
      "headers": ["Уровень", "Бонус мастерства", "Особенности", "Макс. КР", "Прислужники"],
      "rows": [
        ["1", "+2", "Заклинательность, Поднятие Прислужника", "1", "1"],
        ["2", "+2", "Мёртвый Саквояж, Починка Нежити", "1", "1"],
        ["3", "+2", "Некромантическая Традиция", "1", "1"],
        ["4", "+2", "Увеличение характеристик", "1", "1"],
        ["5", "+3", "Усиленные Прислужники", "2", "1"],
        ["6", "+3", "Черта Традиции", "2", "1"],
        ["7", "+3", "Шёпот Могилы", "2", "1"],
        ["8", "+3", "Увеличение характеристик", "2", "1"],
        ["9", "+4", "Второй Прислужник", "4", "2"],
        ["10", "+4", "Великое Воскрешение, Черта Традиции", "4", "2"],
        ["11", "+4", "Черта Традиции", "4", "2"],
        ["12", "+4", "Увеличение характеристик", "4", "2"],
        ["13", "+5", "Третий Прислужник", "6", "3"],
        ["14", "+5", "Черта Традиции", "6", "3"],
        ["15", "+5", "Чувство Смерти", "6", "3"],
        ["16", "+5", "Увеличение характеристик", "6", "3"],
        ["17", "+6", "Четвёртый Прислужник", "8", "4"],
        ["18", "+6", "Черта Традиции", "8", "4"],
        ["19", "+6", "Увеличение характеристик", "8", "4"],
        ["20", "+6", "Владыка Смерти", "8", "4"]
      ]
    },
    {
      "title":"Ячейки заклинаний",
      "headers": ["Уровень", "1-й", "2-й", "3-й", "4-й", "5-й", "6-й", "7-й", "8-й", "9-й"],
      "rows": [
        ["1", "2", "—", "—", "—", "—", "—", "—", "—", "—"],
        ["2", "3", "—", "—", "—", "—", "—", "—", "—", "—"],
        ["3", "4", "2", "—", "—", "—", "—", "—", "—", "—"],
        ["4", "4", "3", "—", "—", "—", "—", "—", "—", "—"],
        ["5", "4", "3", "2", "—", "—", "—", "—", "—", "—"],
        ["6", "4", "3", "3", "—", "—", "—", "—", "—", "—"],
        ["7", "4", "3", "3", "1", "—", "—", "—", "—", "—"],
        ["8", "4", "3", "3", "2", "—", "—", "—", "—", "—"],
        ["9", "4", "3", "3", "3", "1", "—", "—", "—", "—"],
        ["10", "4", "3", "3", "3", "2", "—", "—", "—", "—"],
        ["11", "4", "3", "3", "3", "2", "1", "—", "—", "—"],
        ["12", "4", "3", "3", "3", "2", "1", "—", "—", "—"],
        ["13", "4", "3", "3", "3", "2", "1", "1", "—", "—"],
        ["14", "4", "3", "3", "3", "2", "1", "1", "—", "—"],
        ["15", "4", "3", "3", "3", "2", "1", "1", "1", "—"],
        ["16", "4", "3", "3", "3", "2", "1", "1", "1", "—"],
        ["17", "4", "3", "3", "3", "2", "1", "1", "1", "1"],
        ["18", "4", "3", "3", "3", "2", "1", "1", "1", "1"],
        ["19", "4", "3", "3", "3", "2", "2", "1", "1", "1"],
        ["20", "4", "3", "3", "3", "2", "2", "2", "1", "1"]
      ]
    }
  ]
}
];
