const _DAY_SHIFT = "shift-day";
const _NIGHT_SHIFT = "shift-night";
const _START_NIGHT_SHIFT = "shift-night-st";
const _END_NIGHT_SHIFT = "shift-night-en";
const _DAY_OFF = "shift-off";
const _UNKNOWN_SHIFT = "shift-unknown";

const shift = {};

shift.A = [7*8];
shift.B = [7*8];
shift.C = [7*8];
shift.D = [7*8];

// -------------------------------------
// 35 1-1. MON
shift.A[0]= _DAY_OFF;
shift.B[0]= _START_NIGHT_SHIFT;
shift.C[0]= _END_NIGHT_SHIFT;
shift.D[0]= _DAY_SHIFT;
// 1-2. TUE
shift.A[1]=_DAY_SHIFT;
shift.B[1]=_NIGHT_SHIFT;
shift.C[1]=_DAY_OFF;
shift.D[1]=_DAY_OFF;
// 1-3. WED
shift.A[2]=_DAY_SHIFT;
shift.B[2]=_END_NIGHT_SHIFT;
shift.C[2]=_DAY_OFF;
shift.D[2]=_START_NIGHT_SHIFT;
// 1-4. THU
shift.A[3]=_DAY_OFF;
shift.B[3]=_DAY_OFF;
shift.C[3]=_DAY_SHIFT;
shift.D[3]=_NIGHT_SHIFT;
// 1-5. FRI
shift.A[4]=_DAY_OFF;
shift.B[4]=_START_NIGHT_SHIFT;
shift.C[4]=_DAY_SHIFT;
shift.D[4]=_END_NIGHT_SHIFT;
// 1-6. SAT
shift.A[5]=_DAY_SHIFT;
shift.B[5]=_NIGHT_SHIFT;
shift.C[5]=_DAY_OFF;
shift.D[5]=_DAY_OFF;
// 1-7. SUN
shift.A[6]=_DAY_SHIFT;
shift.B[6]=_NIGHT_SHIFT;
shift.C[6]=_DAY_OFF;
shift.D[6]=_DAY_OFF;
// -------------------------------------
// 36 2-1. MON
shift.A[7]=_DAY_SHIFT;
shift.B[7]=_END_NIGHT_SHIFT;
shift.C[7]=_DAY_OFF;
shift.D[7]=_START_NIGHT_SHIFT;
// 2-2. TUE
shift.A[8]=_DAY_OFF;
shift.B[8]=_DAY_OFF;
shift.C[8]=_DAY_SHIFT;
shift.D[8]=_NIGHT_SHIFT;
// 2-3. WED
shift.A[9]=_DAY_OFF;
shift.B[9]=_START_NIGHT_SHIFT;
shift.C[9]=_DAY_SHIFT;
shift.D[9]=_END_NIGHT_SHIFT;
// 2-4. THU
shift.A[10]=_DAY_SHIFT;
shift.B[10]=_NIGHT_SHIFT;
shift.C[10]=_DAY_OFF;
shift.D[10]=_DAY_OFF;
// 2-5. FRI
shift.A[11]=_DAY_SHIFT;
shift.B[11]=_END_NIGHT_SHIFT;
shift.C[11]=_DAY_OFF;
shift.D[11]=_START_NIGHT_SHIFT;
// 2-6. SAT
shift.A[12]=_DAY_OFF;
shift.B[12]=_DAY_OFF;
shift.C[12]=_DAY_SHIFT;
shift.D[12]=_NIGHT_SHIFT;
// 2-7. SUN
shift.A[13]=_DAY_OFF;
shift.B[13]=_DAY_OFF;
shift.C[13]=_DAY_SHIFT;
shift.D[13]=_NIGHT_SHIFT;
// -------------------------------------
// 37 3-1. MON
shift.A[14]=_DAY_OFF;
shift.B[14]=_START_NIGHT_SHIFT;
shift.C[14]=_DAY_SHIFT;
shift.D[14]=_END_NIGHT_SHIFT;
// 3-2. TUE
shift.A[15]=_DAY_SHIFT;
shift.B[15]=_NIGHT_SHIFT;
shift.C[15]=_DAY_OFF;
shift.D[15]=_DAY_OFF;
// 3-3. WED
shift.A[16]=_DAY_SHIFT;
shift.B[16]=_END_NIGHT_SHIFT;
shift.C[16]=_DAY_OFF;
shift.D[16]=_START_NIGHT_SHIFT;
// 3-4. THU
shift.A[17]=_DAY_OFF;
shift.B[17]=_DAY_OFF;
shift.C[17]=_DAY_SHIFT;
shift.D[17]=_NIGHT_SHIFT;
// 3-5. FRI
shift.A[18]=_DAY_OFF;
shift.B[18]=_START_NIGHT_SHIFT;
shift.C[18]=_DAY_SHIFT;
shift.D[18]=_END_NIGHT_SHIFT;
// 3-6. SAT
shift.A[19]=_DAY_SHIFT;
shift.B[19]=_NIGHT_SHIFT;
shift.C[19]=_DAY_OFF;
shift.D[19]=_DAY_OFF;
// 3-7. SUN
shift.A[20]=_DAY_SHIFT;
shift.B[20]=_NIGHT_SHIFT;
shift.C[20]=_DAY_OFF;
shift.D[20]=_DAY_OFF;
// -------------------------------------
// 38 4-1. MON
shift.A[21]=_DAY_SHIFT;
shift.B[21]=_END_NIGHT_SHIFT;
shift.C[21]=_DAY_OFF;
shift.D[21]=_START_NIGHT_SHIFT;
// 4-2. TUE
shift.A[22]=_DAY_OFF;
shift.B[22]=_DAY_OFF;
shift.C[22]=_DAY_SHIFT;
shift.D[22]=_NIGHT_SHIFT;
// 4-3. WED
shift.A[23]=_DAY_OFF;
shift.B[23]=_START_NIGHT_SHIFT;
shift.C[23]=_DAY_SHIFT;
shift.D[23]=_END_NIGHT_SHIFT;
// 4-4. THU
shift.A[24]=_DAY_SHIFT;
shift.B[24]=_NIGHT_SHIFT;
shift.C[24]=_DAY_OFF;
shift.D[24]=_DAY_OFF;
// 4-5. FRI
shift.A[25]=_DAY_SHIFT;
shift.B[25]=_END_NIGHT_SHIFT;
shift.C[25]=_DAY_OFF;
shift.D[25]=_START_NIGHT_SHIFT;
// 4-6. SAT
shift.A[26]=_DAY_OFF;
shift.B[26]=_DAY_OFF;
shift.C[26]=_DAY_SHIFT;
shift.D[26]=_NIGHT_SHIFT;
// 4-7. SUN
shift.A[27]=_DAY_OFF;
shift.B[27]=_DAY_OFF;
shift.C[27]=_DAY_SHIFT;
shift.D[27]=_NIGHT_SHIFT;
// -------------------------------------
// 39 5-1. MON
shift.A[28]=_START_NIGHT_SHIFT;
shift.B[28]=_DAY_OFF;
shift.C[28]=_DAY_SHIFT;
shift.D[28]=_END_NIGHT_SHIFT;
// 5-2. TUE
shift.A[29]=_NIGHT_SHIFT;
shift.B[29]=_DAY_SHIFT;
shift.C[29]=_DAY_OFF;
shift.D[29]=_DAY_OFF;
// 5-3. WED 
shift.A[30]=_END_NIGHT_SHIFT;
shift.B[30]=_DAY_SHIFT;
shift.C[30]=_START_NIGHT_SHIFT;
shift.D[30]=_DAY_OFF;
// 5-4. THU
shift.A[31]=_DAY_OFF;
shift.B[31]=_DAY_OFF;
shift.C[31]=_NIGHT_SHIFT;
shift.D[31]=_DAY_SHIFT;
// 5-5. FRI
shift.A[32]=_START_NIGHT_SHIFT;
shift.B[32]=_DAY_OFF;
shift.C[32]=_END_NIGHT_SHIFT;
shift.D[32]=_DAY_SHIFT;
// 5-6. SAT
shift.A[33]=_NIGHT_SHIFT;
shift.B[33]=_DAY_SHIFT;
shift.C[33]=_DAY_OFF;
shift.D[33]=_DAY_OFF;
// 5-7. SUN
shift.A[34]=_NIGHT_SHIFT;
shift.B[34]=_DAY_SHIFT;
shift.C[34]=_DAY_OFF;
shift.D[34]=_DAY_OFF;
// -------------------------------------
// 40 6-1. MON
shift.A[35]=_END_NIGHT_SHIFT;
shift.B[35]=_DAY_SHIFT;
shift.C[35]=_START_NIGHT_SHIFT;
shift.D[35]=_DAY_OFF;
// 6-2. TUE
shift.A[36]=_DAY_OFF;
shift.B[36]=_DAY_OFF;
shift.C[36]=_NIGHT_SHIFT;
shift.D[36]=_DAY_SHIFT;
// 6-3. WED
shift.A[37]=_START_NIGHT_SHIFT;
shift.B[37]=_DAY_OFF;
shift.C[37]=_END_NIGHT_SHIFT;
shift.D[37]=_DAY_SHIFT;
// 6-4. THU
shift.A[38]=_NIGHT_SHIFT;
shift.B[38]=_DAY_SHIFT;
shift.C[38]=_DAY_OFF;
shift.D[38]=_DAY_OFF;
// 6-5. FRI
shift.A[39]=_END_NIGHT_SHIFT;
shift.B[39]=_DAY_SHIFT;
shift.C[39]=_START_NIGHT_SHIFT;
shift.D[39]=_DAY_OFF;
// 6-6. SAT
shift.A[40]=_DAY_OFF;
shift.B[40]=_DAY_OFF;
shift.C[40]=_NIGHT_SHIFT;
shift.D[40]=_DAY_SHIFT;
// 6-7. SUN
shift.A[41]=_DAY_OFF;
shift.B[41]=_DAY_OFF;
shift.C[41]=_NIGHT_SHIFT;
shift.D[41]=_DAY_SHIFT;
// -------------------------------------
// 41 7-1. MON
shift.A[42]=_START_NIGHT_SHIFT;
shift.B[42]=_DAY_OFF;
shift.C[42]=_END_NIGHT_SHIFT;
shift.D[42]=_DAY_SHIFT;
// 7-2. TUE
shift.A[43]=_NIGHT_SHIFT;
shift.B[43]=_DAY_SHIFT;
shift.C[43]=_DAY_OFF;
shift.D[43]=_DAY_OFF;
// 7-3. WED
shift.A[44]=_END_NIGHT_SHIFT;
shift.B[44]=_DAY_SHIFT;
shift.C[44]=_START_NIGHT_SHIFT;
shift.D[44]=_DAY_OFF;
// 7-4. THU
shift.A[45]=_DAY_OFF;
shift.B[45]=_DAY_OFF;
shift.C[45]=_NIGHT_SHIFT;
shift.D[45]=_DAY_SHIFT;
// 7-5. FRI
shift.A[46]=_START_NIGHT_SHIFT;
shift.B[46]=_DAY_OFF;
shift.C[46]=_END_NIGHT_SHIFT;
shift.D[46]=_DAY_SHIFT;
// 7-6. SAT
shift.A[47]=_NIGHT_SHIFT;
shift.B[47]=_DAY_SHIFT;
shift.C[47]=_DAY_OFF;
shift.D[47]=_DAY_OFF;
// 7-7. SUN
shift.A[48]=_NIGHT_SHIFT;
shift.B[48]=_DAY_SHIFT;
shift.C[48]=_DAY_OFF;
shift.D[48]=_DAY_OFF;
// -------------------------------------
// 42 8-1. MON
shift.A[49]=_END_NIGHT_SHIFT;
shift.B[49]=_DAY_SHIFT;
shift.C[49]=_START_NIGHT_SHIFT;
shift.D[49]=_DAY_OFF;
// 8-2. TUE
shift.A[50]=_DAY_OFF;
shift.B[50]=_DAY_OFF;
shift.C[50]=_NIGHT_SHIFT;
shift.D[50]=_DAY_SHIFT;
// 8-3. WED
shift.A[51]=_START_NIGHT_SHIFT;
shift.B[51]=_DAY_OFF;
shift.C[51]=_END_NIGHT_SHIFT;
shift.D[51]=_DAY_SHIFT;
// 8-4. THU
shift.A[52]=_NIGHT_SHIFT;
shift.B[52]=_DAY_SHIFT;
shift.C[52]=_DAY_OFF;
shift.D[52]=_DAY_OFF;
// 8-5. FRI
shift.A[53]=_END_NIGHT_SHIFT;
shift.B[53]=_DAY_SHIFT;
shift.C[53]=_START_NIGHT_SHIFT;
shift.D[53]=_DAY_OFF;
// 8-6. SAT
shift.A[54]=_DAY_OFF;
shift.B[54]=_DAY_OFF;
shift.C[54]=_NIGHT_SHIFT;
shift.D[54]=_DAY_SHIFT;
// 8-7. SUN
shift.A[55]=_DAY_OFF;
shift.B[55]=_DAY_OFF;
shift.C[55]=_NIGHT_SHIFT;
shift.D[55]=_DAY_SHIFT;
