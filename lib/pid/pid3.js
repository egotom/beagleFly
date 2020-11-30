// Adapted from https://github.com/br3ttb/Arduino-PID-Library
function PID(p, i, d) {
  this.sampleTime = 100
  this.target = 0
  this.output = 0

  this.errorSum = 0
  this.lastInput = 0
  this.lastTime = Date.now() - this.sampleTime

  this.setTunings(p, i, d)  
}

PID.prototype.setTunings = function(p, i, d) {
  var ratio = this.sampleTime / 1000
  
  this.p = p
  this.i = i * ratio
  this.d = d / ratio
}

PID.prototype.setSampleTime = function(sampleTime) {
  var ratio = sampleTime / this.sampleTime
  
  this.i *= ratio
  this.d /= ratio
  this.sampleTime = sampleTime
}

PID.prototype.setOutputLimits = function(min, max) {
  this.min = min
  this.max = max
}

PID.prototype.setTarget = function(value) {
  this.target = value
}

PID.prototype.compute = function(input) {
  var now = Date.now(),
      timeDiff = now - this.lastTime
  
  if (timeDiff >= this.sampleTime) {
    var error = this.target - input,
        inputDiff = input - this.lastInput
    
    this.errorSum = Math.max(this.min, Math.min(this.max, this.errorSum + (this.i * error)))    
    this.output = Math.max(this.min, Math.min(this.max, (this.p * error) + this.errorSum - (this.d * inputDiff)))
    this.lastInput = input
    this.lastTime = now
  }                                         
  return this.output
}
// Adapted from https://github.com/br3ttb/Arduino-PID-AutoTune-Library
function ATune(input,output){
	this.input=input
	this.output=output
	this.noiseBand=0.5
	this.running = false
	this.oStep = 30
	this.SetLookbackSec(10)
	this.lastTime = Date.now()
}
ATune.prototype.SetLookbackSec = function(value){
    if (value<1) value = 1
	if(value<25)
	{
		this.nLookBack = value * 4
		this.sampleTime = 250
	}
	else
	{
		this.nLookBack = 100
		this.sampleTime = value*10
	}
}
ATune.prototype.Cancel = function(){
	this.running=false
}
ATune.prototype.FinishUp = function()
{
	  this.output = this.outputStart	//we can generate tuning parameters!
      this.Ku = 4*(2*this.oStep)/((this.absMax-this.absMin)*3.14159)
      this.Pu = (this.peak1-this.peak2) / 1000
}
ATune.prototype.Runtime = function(){
	this.justevaled=false
	if(this.peakCount>9 && this.running)
	{
		this.running = false
		this.FinishUp()
		return 1
	}
	var now = Date.now()
	
	if((now-this.lastTime)<this.sampleTime) return false;
	this.lastTime = now
	var refVal = this.input
	this.justevaled=true
	if(!this.running)
	{ //initialize working variables the first time around
		this.peakType = 0
		this.peakCount=0
		this.justchanged=false
		this.absMax=refVal
		this.absMin=refVal
		this.setpoint = refVal
		this.running = true
		this.outputStart = this.output
		this.output = this.outputStart+this.oStep
	}
	else
	{
		if(refVal>this.absMax)this.absMax=refVal
		if(refVal<this.absMin)this.absMin=refVal
	}
	
	//oscillate the output base on the input's relation to the setpoint
	
	if(refVal>this.setpoint+this.noiseBand) this.output = this.outputStart-this.oStep
	else if (refVal<this.setpoint-this.noiseBand) this.output = this.outputStart+this.oStep
	
	
  //bool isMax=true, isMin=true;
  this.isMax=true
  this.isMin=true
  //id peaks
  for(let i=this.nLookBack-1;i>=0;i--)
  {
    var val = this.lastInputs[i]
    if(this.isMax) this.isMax = refVal>val
    if(this.isMin) this.isMin = refVal<val
    this.lastInputs[i+1] = this.lastInputs[i]
  }
  this.lastInputs[0] = refVal
  if(this.nLookBack<9)
  {  return 0} //we don't want to trust the maxes or mins until the inputs array has been filled
  
  if(this.isMax)
  {
    if(this.peakType==0)this.peakType=1
    if(this.peakType==-1)
    {
      this.peakType = 1
      this.justchanged=true
      this.peak2 = this.peak1
    }
    this.peak1 = now
    this.peaks[this.peakCount] = refVal
   
  }
  else if(this.isMin)
  {
    if(this.peakType==0)peakType=-1
    if(this.peakType==1)
    {
      this.peakType=-1
      this.peakCount++
      this.justchanged=true
    }
    
    if(this.peakCount<10)this.peaks[this.peakCount] = refVal;
  }
  
  if(this.justchanged && this.peakCount>2)
  { //we've transitioned.  check if we can autotune based on the last peaks
    var avgSeparation = (Math.abs(this.peaks[this.peakCount-1]-this.peaks[this.peakCount-2])+Math.abs(this.peaks[this.peakCount-2]-this.peaks[this.peakCount-3]))/2;
    if( avgSeparation < 0.05*(this.absMax-this.absMin))
    {
      this.FinishUp()
      this.running = false
	  return 1
    }
  }
   this.justchanged=false
   return 0
}
ATune.prototype.GetKi = function()
{
	return controlType==1? 1.2*this.Ku / this.Pu : 0.48 * this.Ku / this.Pu  // Ki = Kc/Ti
}
ATune.prototype.GetKd = function()
{
	return this.controlType==1? 0.075 * this.Ku * this.Pu : 0  //Kd = Kc * Td
}
ATune.prototype.SetOutputStep = function( Step)
{
	this.oStep = Step
}
ATune.prototype.GetOutputStep = function()
{
	return this.oStep
}
ATune.prototype.SetControlType = function( Type) //0=PI, 1=PID
{
	this.controlType = Type
}
ATune.prototype.GetControlType = function()
{
	return this.controlType
}
ATune.prototype.SetNoiseBand = function( Band)
{
	this.noiseBand = Band
}
ATune.prototype.GetNoiseBand = function()
{
	return this.noiseBand
}
ATune.prototype.GetLookbackSec = function()
{
	return this.nLookBack * this.sampleTime / 1000
}

var pid = new PID(875, 0.5, 0.1)
pid.setSampleTime(1000)
pid.setOutputLimits(0, 10000)
pid.setTarget(60)
var tune= new ATune()
console.log(tune)
setInterval(function() {
  var output = pid.compute(50 + (Math.random() * 10))
  console.log(output)
}, 50)