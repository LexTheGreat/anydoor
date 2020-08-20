function getNearestVeh() {
	var pos = GetEntityCoords(GetPlayerPed(-1))
	var entityWorld = GetOffsetFromEntityInWorldCoords(GetPlayerPed(-1), 0.0, 2.0, 0.0);
	
	var rayHandle = StartShapeTestRay(pos[0], pos[1], pos[2], entityWorld[0], entityWorld[1], entityWorld[2], 10, GetPlayerPed(-1), 0);
	var retArray = GetShapeTestResult(rayHandle);
	return retArray[4];
}

function chatMessage(msg) {
	emit('chatMessage', msg)
}

function HelpText(text) {
    SetTextComponentFormat("STRING");
    AddTextComponentString(text);
    DisplayHelpTextFromStringLabel(0, 0, 0, -1);
}

anydoortoggle = false;
RegisterCommand('tad', (source, args, rawCommand) => {
	anydoortoggle = !anydoortoggle;
}, false)

var targetVeh = 0;
var tmpVeh = 0;
setTick(() => {
	if (!anydoortoggle)
		return;
	
	var pos = GetEntityCoords(GetPlayerPed(-1))
	var entityWorld = GetOffsetFromEntityInWorldCoords(GetPlayerPed(-1), 0.0, 2.0, 0.0);
	//DrawLine(pos[0], pos[1], pos[2], entityWorld[0], entityWorld[1], entityWorld[2], 255,0,0,255)
	
	tmpVeh = getNearestVeh();
	if (targetVeh != tmpVeh && tmpVeh != 0) {
		targetVeh = tmpVeh;
	}
	if (targetVeh == 0)
		return;
	
	var vehPos = GetEntityCoords(targetVeh);
	var vehRot = GetEntityRotation(targetVeh, false);

	if (GetVehiclePedIsIn(GetPlayerPed(source)) != 0)
		return;
	
	for(var i = 0; i < GetNumberOfVehicleDoors(targetVeh); i++) {
		//DrawMarker(27, vehPos[0]-2, vehPos[1], vehPos[2]-0.5, 0.0, 0.0, 0.0, vehRot[0], vehRot[1], vehRot[2], 0.5, 0.5, 1.0, 0, 255, 0, 50, false, true, 2, null, null, false)
		var doorPos = GetEntryPositionOfDoor(targetVeh, i)
		
		var color = [0,255,0];
		if (!IsVehicleSeatFree(targetVeh, i-1)) {
			color = [255,0,0];
		}
		
		DrawMarker(27, doorPos[0], doorPos[1], doorPos[2]-1, 0.0, 0.0, 0.0, 0,0,0, 1.0, 1.0, 1.0, color[0], color[1], color[2], 50, false, true, 2, null, null, false)
		
		if (GetDistanceBetweenCoords(pos[0], pos[1], pos[2], doorPos[0], doorPos[1], doorPos[2], false) < 0.5) {
			HelpText("Press E to enter, H to open door");
			
			if (IsControlJustReleased(0, 38)) {
				TaskEnterVehicle(GetPlayerPed(-1), targetVeh, -1, i-1, 1.0, 1, 0);
			} else if (IsControlJustReleased(0, 74)) {
				TaskOpenVehicleDoor(GetPlayerPed(-1), targetVeh, -1, i-1, 1.0);
			}
		}
	}
})
