//--------------------------------
//------- Code de base -----------
//--------------------------------
var weapons = getWeapons();
var chips = getChips();
var enemy = getNearestEnemy();
var me = getLeek();

// On prend le pistolet
function canDamage(weapons, leek)
{
	for (var w in weapons)
		if (canUseWeapon(w, leek))
			return true;
	return false;
}
function selectBestWeapon(weapons, enemy)
{
	if (getTP() < 3)
		return null;
	var weapon = null;
	var maxDPS = -1;
	for (var w in weapons)
	{
		if (canUseWeapon(w, enemy))
		{
			var dps = 0;
			var tp = getTP();
			if (w != getWeapon())
				tp --;
			dps = floor(tp / getWeaponCost(w)) * getWeaponEffects(w)[0][1];
			if(dps > maxDPS)
			{
				weapon = w;
				maxDPS = dps;
			}
		}
	}
	if (weapon != getWeapon())
		setWeapon(weapon);
	return weapon;
}

while(getMP() != 0 && !canDamage(weapons,  enemy))
{
	moveToward(enemy, 1);
}

if (canDamage(weapons,  enemy))
{
	var currentWeapon = selectBestWeapon(weapons, enemy);
	while(getTP() > getWeaponCost(currentWeapon))
	{
		useWeapon(enemy);
		if (!isAlive(enemy))
			break;
	}
}
moveAwayFrom(enemy);
if (getWeapon() == null)
{
	var range = 0;
	var weapon = null;
	for (var w in weapons)
	{
		if (getWeaponMaxRange(w) > range)
		{
			range = getWeaponMaxRange(w);
			weapon = w;
		}
	}
	setWeapon(weapon);	
}

for (var i = 5; i >= 0; i--)
{
	for (var chip in chips)
	{
		if (getChipCooldown(chip) == i)
		{
			var target = me;
			var effectType = getChipEffects(chip)[0][0];
			if (effectType == EFFECT_DAMAGE)
				target = enemy;
			if (effectType == EFFECT_HEAL && getLife() == getTotalLife())
				continue;
			if(canUseChip(chip, target))
			{
				useChip(chip, target);
				if(i == 0)
				{
					while(getTP() > getChipCost(chip))
						useChip(chip, target);
				}
			}
		}
	}
}
