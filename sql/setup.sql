-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS violations;
DROP TABLE IF EXISTS insults;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slack_id TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL
);

CREATE TABLE violations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    comment TEXT NOT NULL,
    identity_attack BOOLEAN NOT NULL,
    insult BOOLEAN NOT NULL,
    obscene BOOLEAN NOT NULL,
    severe_toxicity BOOLEAN NOT NULL,
    sexually_explicit BOOLEAN NOT NULL,
    threat BOOLEAN NOT NULL,
    toxicity BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE insults (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    adjective_1 TEXT NOT NULL,
    adjective_2 TEXT NOT NULL,
    noun TEXT NOT NULL
);

INSERT INTO users(slack_id, is_admin)
VALUES 
('U03BU14ULTT', true), 
('U03BFD3DGNP', true), 
('U03BHNUGSH2', true);

INSERT INTO
    insults(adjective_1, adjective_2, noun)
VALUES
    (artless, base-court, apple-john)
    (bawdy, bat-fowling, baggage)
    (beslubbering, beef-witted, barnacle)
    (bootless, beetle-headed, bladder)
    (churlish, boil-brained, boar-pig)
    (cockered, clapper-clawed, bugbear)
    (clouted, clay-brained, bum-bailey)
    (craven, common-kissing, canker-blossom)
    (currish, crook-pated, clack-dish)
    (dankish, dismal-dreaming, clotpole)
    (dissembling, dizzy-eyed, coxcomb)
    (droning, doghearted codpiece,)
    (errant, dread-bolted, death-token)
    (fawning, earth-vexing, dewberry)
    (fobbing, elf-skinned, flap-dragon)
    (froward, fat-kidneyed, flax-wench)
    (frothy, fen-sucked, flirt-gill)
    (gleeking, flap-mouthed, foot-licker)
    (goatish, fly-bitten, fustilarian)
    (gorbellied, folly-fallen, giglet)
    (impertinent, fool-born, gudgeon)
    (infectious, full-gorged, haggard)
    (jarring, guts-griping, harpy)
    (loggerheaded, half-faced, hedge-pig)
    (lumpish, hasty-witted, horn-beast)
    (mammering, hedge-born, hugger-mugger)
    (mangled, hell-hated, joithead)
    (mewling, idle-headed, lewdster)
    (paunchy, ill-breeding, lout)
    (pribbling, ill-nurtured, maggot-pie)
    (puking, knotty-pated, malt-worm)
    (puny, milk-livered, mammet)
    (qualling, motley-minded, measle)
    (rank, onion-eyed, minnow)
    (reeky, plume-plucked, miscreant)
    (roguish, pottle-deep, moldwarp)
    (ruttish, pox-marked, mumble-news)
    (saucy, reeling-ripe, nut-hook)
    (spleeny, rough-hewn, pigeon-egg)
    (spongy, rude-growing, pignut)
    (surly, rump-fed, puttock)
    (tottering, shard-borne, pumpion)
    (unmuzzled, sheep-biting, ratsbane)
    (vain, spur-galled, scut)
    (venomed, swag-bellied, skainsmate)
    (villainous, tardy-gaited, strumpet)
    (warped, tickle-brained, varlot)
    (wayward, toad-spotted, vassal)
    (weedy, unchin-snouted, whey-face)
    (yeasty, weather-bitten, wagtail)
    