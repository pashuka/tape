const { tables } = require("../../constants");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const fixtures = {
  usernames: [
    ["pav", "test1"],
    ["pav", "test2"],
    ["pav", "test3"],
    ["pav", "test4"],
    ["pav", "test5"],
    ["pav", "test6"],
    ["pav", "test7"],
    ["pav", "test8"],
    ["pav", "test9"],
    ["test1", "test2"],
    ["test1", "test3"],
    ["test1", "test4"],
    ["test1", "test5"],
    ["test1", "test6"],
    ["test1", "test7"],
    ["test1", "test8"],
    ["test1", "test9"],
    ["test2", "test3"],
    ["test2", "test4"],
    ["test2", "test5"],
    ["test2", "test6"],
    ["test2", "test7"],
    ["test2", "test8"],
    ["test2", "test9"],
  ],
  messages: [
    'I like how the "please" was only in team chat. Undercover nice guy',
    "Of course! One must never reveal to the enemy your soft and polite side, you must assert DOMINANCE!",
    "I never understood why people and admins on servers of a fucking war game were so sensitive about swearing on the server. Annoyed the hell out of me in bf3 and bf4",
    "Or a game like gta v where you can make and sell drugs, use hookers, and murder countless people, but no swearing in the online chat!",
    `Kills hooker, steals back money, kills cops chasing me, run over several innocent bystanders along the way, kills player trying to get in on the action

    "Hah, take that you fucker!"

    BANNED`,
    `it must be because we are breaking the fourth wall. It's okay for characters in a fictional setting to do as they please, but the moment someone breaks the fourth wall by communicating with non-fictional entities, like other players or slanging in the all chat, the contract of disbelief gets broken, affecting more than the fictional universe of the game. It doesn't appear to make sense, but it does, especially in games which has the most personal interactions of any art form.`,
    `I just got GTA V again for the first time since ‘015 and I had forgotten how nice it is to be able to murder people that drive like assholes. What a great game.`,
    `I drive perfectly safe in GTA V, trying to keep my car as clean as possible.

    UNLESS I see a cyclist or motorbike in front of me. I have no idea why, but I just keep my virtual foot on the gas and drive straight into them. Every time.

    `,
    `The GTA games are programmed to do that. Try driving properly; random pedestrians and drivers will get in your way and try to cause shit for you, the player, to murder them over.`,
    `I drive perfectly safe in GTA V, trying to keep my car as clean as possible.

    All fun and games until some spastic in an SUV cuts 4 lanes of traffic to get onto the exit lane and slides right into your path without giving you any time to adjust.`,
    `It's mainly about harassment. NPC swearing at you is fine, because the player knows its a game. When a real live player is saying mean and hateful things toward you, it can be internalized differently.`,
    `Problem with that is non-swears can hurt way more, I could call you a dick or I could say you're worthless and nobody loves you, the latter hurts more`,
    `It’s mostly the opposite. Swearing on TV has gotten really lax, but we’re a long way from nudity on anything but premium channels. South Park made a big deal about being able to say shit and that was almost 20 years ago.

    Violence on the other hand, we seem completely OK with.`,
    `Battlefield admin: "NO SWEARING"

    Also Battlefield admin:

    <someone gets knifed>

    Some plugin the admin chose to use:

    "<playerA> ABSOLUTELY MOTHERFUCKING FUCKING FUCKERDEFUCKED <playerB> THE FUCK UP, <playerB> IS SUCH A CUNTFUCK FOR GETTING KNIFE, WHAT YA GONNA DO ABOUT IT YOU WORTHLESS TRASH LOSER????"`,
    `There’s a big difference between kids playing fictional depictions of war for entertainment and actually interacting with other people who constantly use bad language. I think we all agree kids aren’t being more violent because of the game, but can think it’s cool to use bad language and try to emulate that in real life in a way that will probably cause blowback on all gamers. So the language restrictions are actually a way to protect everyone from the Karens of the world and prematurely corrupting young minds.`,
    `It's the Internet Era, way back if a kid wanted to know something prematurely, he would need a PC, now, they have it on a phone at their hands, there should be no filters on any +18 kind of games, if a kid is playing that game, is because the parents let him play it, and probably also let the kid own a phone with no restrictions, I find stupid making a 30 year old guy playing a +18 game look around for a way to say "Ass" because the game doesn't alow it.`,
    `Yeah but you don't have access to your mums credit card any longer so you are not worth the consideration, gotta pretend to be child friendly for them $$$.`,
    `The old methods still work well enough: ¡¡¡7070707 - ¡3704558`,
    `Plus the ESRB doesn't rate online interactions. At least I've heard that's why a lot of online games don't allow swearing.`,
    `GTA Online always cracked me up. The NPC civilians would say some hilariously terrible things all the time just walking by. But online chat is restricted to a crazy degree. Even the name "Jerry" is censored.`,
    `It's mainly about harassment. NPC swearing at you is fine, because the player knows its a game. When a real live player is saying mean and hateful things toward you, it can be internalized differently.`,
    `I thought they just automatically implied it was an M for online interactions? I've been zoning those logos out my entire life though.`,
    `Nope. The ESRB does not rate online interactions. Even on their website, the listing for GTA v says that the online interactions aren't rated.`,
    `No, it's specifically not rated because they can't control or predict anything in the online multiplayer games. All the chat filters in the world won't stop a dedicated asshat from shooting penises into walls all over the town.`,
    `Every single video game on this planet has to be age rated by certain organizations (such as ESRB) to make sure that it is appropriate with the target audience, meanwhile certain games that have online communication aren’t rated by these organizations, because you can’t control the speech of the players; and I bet you that not even a single parent cares to pay attention to that because they think “it’s just a video game”. Therefore it’s not the child’s fault for being teased to look up “blue waffle” through an online game, it’s their parents who are careless.`,
    `Because we are playing a game for fun and it’s not fun when a grown adult just starts hurling insults and slurs at you because you couldn’t commit to playing a game 8 hours a day to be good enough. I’ve all but left Multiplay games because some people forget not everyone is able to make this a part time job. I’m 36 and won’t sit through someone telling me I’m a terrible human being because I missed a shot or let them die.

    Edit: let me add real quick, it’s when the swearing is directed at someone that I can’t stand, I don’t care if I see an emotional “fuck” or something, but toxic people are toxic and they ruin it for everyone else.`,
    `I really hate the global filters on games. OK If you're playing hello kitty adventure no prob but if it's an 18+ game then come on. Best are the games that have an optional filter, that's also fine. Worst are the games that block every word that is even remotely rude.

    In a game I've played with a Domination mode, you can't actually say Domination as it's a banned word... same with a game about Gods where you can't type God. Fucking ridiculous.`,
    `Then you’ll hate CoD: Modern Warfare on PC, the anti-profanity filter is so awful that random strings of letters in a sentence will be starred-out. It’s basically impossible to communicate over text.`,
    `The same reason there's no issues depicting people getting shot/stabbed/burnt or other forms of wanton violence on prime-time TV but if so much as a nipple slips out people lose their fucking minds.

    Well, at least a female nipple; male nipples are okay. /s`,
    `Violence is fine, sex is not, don't you know lol.`,
    `
    Did you ever play Day of Defeat? Or even when DoD:S when it came out?

    There were sooo many servers that banned immediately for any sort of toxic communication. That community was mostly on lockdown by the exact admins you're talking about.`,
    `Because americans think people violently dying is somehow way better than people saying "bad words".`,
    `in gta online the word "cocaine" is censored, even though one of the main ways to make money in the game is by running businesses such as cocaine and weed.`,
    `Cause its fake war and there are better options than just fuck repeatedly. Its not the vulgarity as much as its just annoying.

    But I'm an old fart who misses some of the old school aspects of online communities.`,
    `A lot of times it's parents/grandparents of kids who play the game as well. Also they just don't want people to have a string of bullshit swearing because once one person sees they can then the morons come out of the woodwork to just spam stupid shit.`,
    `Didn’t BFV have a chat filter automatically applied. Guy stubs his toe in game and screams “AH FUCK IM DYING OVER HERE!” But I try to type “push the objective you bellends” and get my entire message asterisked out...`,
    `BF3 and BF4 is no match to BF5, where the word "fart" gets censored on the official servers.

    It's no problem to have your character screams for mommy in agony as they slowly bleed to death, but God forbid if you use such foul language!`,
    `Yes but why is mass murder ok but some no no words are censored? I try not to swear in games like rocket league for that reason, but it makes no sense in violent games already made for adults.`,
    `Bc they are power hungry`,
    `Being killed by someone is part of the game where as being sworn at by someone isn't.`,
    `Imagine saying ”language“ back in MW2 lobbies, people would have ended you 😂`,
    `cod4 and halo2 is where things got real, mw2 was still intense but things were starting to go soft`,
    `You know it brother if you had your headset on in a CoD4 lobby you had to be prepared for an absolute war!`,
    `Best Battlefield IMO. I’d been playing it for the past 2 months or so, then I got BF 1 and 5 last week. I’m pretty disappointed and upset about them, they are just not very good. There’s something fucky about the aiming that I can’t explain. The sights just move weirdly and unnaturally. In BF4 it feels way better. The colors are also shitty. They’re way too saturated and bright, it doesn’t feel right for a WWII/I game. Also the weapon system is shitty and confusing, the whole interface is confusing and just not well done. The interface is a real eye sore and it makes me not want to fuck around with my weapons, which is a huge part of the game.

    I bet I could write a lot more stuff about it if I was still playing those games. I played BF4 again after about a week of playing 1 and 5 and it was so good. I decided I’m not going to play 5 and 1 any more. I love BF4 so much too, it’s my favorite game. It makes me want to cry that the new ones are so bad (in my opinion).`,
    `agreed, bf4 is one of the best games ive ever played. i can’t speak on the recent ones, but i bought bf4 at a huge discount ages ago and i’ve started playing again quite a lot recently. too bad some unlockables are tied to premium as i only have the standard edition.`,
    `Weird, I preferred 5 over 1. The guns are just too old school and hard to use in 1. I did like the gas mask thing though, that was neat. Some of the levels I played also seemed bad to me, there were a number of times I would just keep getting killed non-stop and it pissed me off. Also I like to build up fortifications at the bases in 5. I did like that you could ride horses in 1 though.

    What made you hate 5 over 1?`,
    `Huh i too prefere BFV over 1 but thats mainly because the gun play in BFV is better/less casual. Bf1 is just hold left Mouse button.`,
    `I used to admin a bf 2142 server. I could not give a flying flamingo what language they used. However I would take steps to stop uncap arty. Usually by calling said person out and using the words stop it you very naughty boy.`,
    `"We teach this young men to rain fire on people but they cant write FUCK on the side of their airplanes because its obscene!"

    Colonel Kurtz dixit`,
    `To be honest I miss battlefield 4 and it's ability to level buildings and cities`,
    `Oh sure, until an ancient Sumerian god slithers a malicious whisper up your spine and compels you to smash your iPad with a stone idol. A stone idol that you have no idea how it ended up in your hand to begin with. As you stare into the hot, glowing ruby eyes of the stone idol, you realize the full gravity of what you've done, but you cannot bring yourself to drop the idol. Another sharp whisper in your ear causes you to turn around. On the horizon is a caravan of slavers, and the glint of the burning sun in the ruby eyes of the stone idol has alerted them to your position. Your life, what's left of it, will be non-stop labor and service as a sub-human slave for a people you cannot understand. All hope is lost, and yet you pray to the stone idol and those red eyes for some sort of forgiveness, though you know not why. The idol whispers to you in a language you do not recognize, yet understand perfectly. It is now a knife in your hand, curved and vicious. The slavers approach, calling out to one another. The decorative dagger is ornate and heavy, much too unwieldy to be for true combat, not that your untrained hand would stand a chance against one of the slavers, let alone several. The Sumerian gods whisper up your spine again, sending a tingling ripple through the rest of your body. There's only one true purpose for such a weapon. You turn it upon yourself, your own neck, and without hesitation, slash your throat open. The slavers are not close enough to see exactly what you've done, and when the walk up to your collapsed corpse, they find your body bloodless and grinning. The bony remains of your hands, skin stretched over the knuckles and tendons like old leather, clutch one thing: A solar powered iPad containing technological knowledge of the future.
    A solar powered calculator. It works without needing batteries, which aren’t around. Doesn’t need the internet or to be plugged in. Innocent enough to make people go wow, but not think of you as some kind of heretic that needs to be burned at the stake`,
    `I’m bringing the Bible to see what was bull shit and what wasn’t`,
    `Then you'll end up losing it after dying from some disease. Someone else will take it and use it to spread tales, and bam you've come full circle and been the cause of the religion.`,
    `Nah, man. It's the year 0. He didn't say what calendar, so it's the absolute zero of time. So after whatever started the universe, probably the big bang. So you'd just be floating out around in large clouds of hydrogen, some of which will slowly condense into stars and galaxies and black holes and stuff.

    Maybe if you bring a space suit, you'll live long enough to not know what it is you're looking at.

    Hey! Maybe that's how life started in the universe. Someone went back in time too far and became the catalyst when they crashed on a proto-Earth.`,
    `This right here is the only realistic answer. Bonus points for being one of the few people to mention that you literally wouldn't be able to communicate with anyone unless you learned the language first (which for anything other than a small handful of historical societies would not be possible before the jump)`,
    `A history book, imagine telling about the future in so many different ways. Telling them about medicine, vaccines, flying machines, better agriculture practices, how to build better technology, and a printing press to help spread the book around. However, who knows how empires will fight and colonize with this knowledge , and imagine how different the future will be from this Edit: yeah the book will probably be biased and I can’t correct or explain to them other events because of the language difference but that book will probably be kept in a super safe place and while the English language developed, they’ll start to decode it. And if they do, it’ll still b a good thing because they will still develop technology a few hundred years early`,
    `Year Zero was 1975. Pol Pot declared it to be year zero - a new start after a total break from the previous government /way of life. It was supposed to usher in a communist utopia. Instead it led to the Cambodian Genocide. Not sure what I'd bring - the people were already pretty freaked out after being marched out of the cities en masse to die.`,
    `man, this brings back memories of reading a book called "first they killed my father" in high school about cambodia. its a really fascinating read but it'll 100% make you feel awful for several hours after every reading session.

    i recommend it to anyone who hasnt read it though, it gives you perspective and is very powerful`,
    `Better bring a Vietnamese battalion or your not going to have fun.

    You seem well educated.`,
    `A book of math, physics, and some engineering projects from around the industrial revolution. All written in Latin. Also enough gold to get me to Rome.`,
    `Spices. Lots of people(today) will think like: "wtf bring iPhone or something."But by year 0, spices were one of the most valuable things. So, I will get my spices, get to year 0, and tell everybody that im from year 2020 and that you can buy spices almost everywhere.`,
    `The New Testament but I’ll rename the gospels Luke and Matthew to Bill and Ted. Now we’ll have the Bible and the Bible 2: Bill and Ted’s excellent adventure and Jesus will lose his mind.`,
    `You don't need to bring anything to make them lose their minds. If my studies have taught me anything, it's that when doing a time warp, it's the pelvic thrust that really drives them insane.`,
    `There might be sometime in the future. OP never specified which direction we were traveling in time. Maybe some cataclysmic event will happen, and survivors will dub that "year 0".

    Either way, I'm bringing tamagotchi. It'll either be futuristic high tech or an ancient relic of a bygone civilization. Also I'm probably not gonna speak the language, so might as well bring entertainment.`,
    `My desktop computer.

    Like just the physical computer would blow their fucking minds. The symmetrical design, hard lines, plastic, metal etc. would look alien as fuck.

    I don't know how much more their minds would be blown if I could also somehow sneak in a monitor and about 50 solar panel chargers to power it on. And then show them my desktop background, and then a game, and some porn.`,
    `So, I’m not sure it would matter what I took back with me. My body carries thousands of bacteria and pathogens against which the immune systems of the people I will encounter have no conceivable defense. I will quite literally be a walking plague, bringing death and destruction anywhere I go.

    I can’t bring enough medicine to help even one-hundredth of the people I am likely to encounter. Even if I could, my reputation would precede me, eventually, and I would be killed from a distance and likely burned. My time among the ancients would be characterized by unavoidable tragedy and pain and, since I speak no language spoken by them, I would be incapable even of warning them of the calamity I both contain and, sadly, for all intents and purposes, have become.

    Therefore, if I absolutely must be transported back, and cannot simply refuse the time travel, I must choose a boat to bring along. Although I will almost certainly go mad due to lack of companionship, I’ll do my best to find a deserted island with some kind of wildlife susceptible to domestication and do my best to survive for my allotted span, cursing those who sent me back and reciting to myself, occasionally, those meager scraps of poetry I once memorized as a child, never suspecting that they would ever be my only connection to that Other world (the one that seems like a dream, now), before the isle of pigs, which, although my contemporaries will never know it, will be until the moment of my death the isle where humanity’s future waits.`,
  ],
};

exports.seed = async (knex) => {
  const listDialogs = fixtures.usernames.map((group) => ({
    owners: JSON.stringify(group),
    participants: JSON.stringify(group),
  }));
  await knex(tables.messages).del();
  await knex(tables.dialogs).del();
  const dialogs = await knex(tables.dialogs)
    .insert(listDialogs)
    .returning(["dialog_id", "participants"]);

  // console.log(dialogs);
  /**
   * [
   *   { id: 1042, participants: [ 'pav', 'test1' ] },
   *   { id: 1043, participants: [ 'pav', 'test2' ] },
   *   { id: 1044, participants: [ 'pav', 'test3' ] },
   *   { id: 1045, participants: [ 'test1', 'test2' ] },
   *   { id: 1046, participants: [ 'test1', 'test3' ] },
   *   { id: 1047, participants: [ 'test2', 'test3' ] }
   * ]
   */

  // Create messages with dialog's id
  let messagesFixture = [];
  dialogs.map(({ dialog_id, participants }) => {
    let messages = [];
    const min = 25;
    const max = Math.floor(Math.random() * min) + min;
    for (let index = 0; index < max; index++) {
      if (messages.length == 0) {
        messages = [...shuffle(fixtures.messages)];
      }
      messagesFixture.push({
        dialog_id,
        body: messages.pop(),
        owner: participants[Math.floor(Math.random() * 2)],
      });
    }
  });

  await Promise.all(
    messagesFixture.map(async (message) => {
      await delay(100 * (Math.floor(Math.random() * 10) + 1));
      return knex(tables.messages).insert(message);
    })
  );

  return knex(tables.messages);

  // return knex(tables.messages).insert(messagesFixture);
};
