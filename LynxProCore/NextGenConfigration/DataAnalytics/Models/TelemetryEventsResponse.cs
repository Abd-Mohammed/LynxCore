using Lynx.Models;
using Lynx.Models.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.DataAnalytics.Models
{
    public class TelemetryEventsResponse : BaseResponse
    {
        public List<TelemetryEventRecord> TelemetryEvents { get; set; }
    }

    public class TelemetryEventRecord
    {
        public string DeviceId { get; set; }

        public string VehicleName { get; set; }

        public DateTime Timestamp { get; set; }

        public TelemetryEventData Data { get; set; }
    }

    public class TelemetryEventData
    {
        public double Heading { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public double Altitude { get; set; }

        public double Speed { get; set; }

        public string SpeedSource { get; set; }

        public double? Hdop { get; set; }

        public string EngineStatus { get; set; }

        public int? SatellitesNo { get; set; }

        public int? GsmSignal { get; set; }

        public string GsmOperator { get; set; }

        public string ReferenceNumber { get; set; }

        public double? PowerSupplyVoltage { get; set; }

        public double? BatteryVoltage { get; set; }

        public int? IdlingTime { get; set; }

        public string StaffId { get; set; }

        public string RfidCode { get; set; }

        public string IbuttonCode { get; set; }

        public double? Ain01 { get; set; }

        public double? Ain02 { get; set; }

        public string EventTypeCode { get; set; }

        public int? AlarmTypeCode { get; set; }

        public bool? LocationStatus { get; set; }

        public double? Temperature { get; set; }

        public Din? Din { get; set; }

        public bool? OverspeedingEvent { get; set; }

        public bool? HarshAccelerationEvent { get; set; }

        public bool? HarshBrakingEvent { get; set; }

        public bool? HarshCorneringEvent { get; set; }

        public double? AbsoluteAcceleration { get; set; }

        public double? XAcceleration { get; set; }

        public double? YAcceleration { get; set; }

        public double? ZAcceleration { get; set; }

        public double? SegmentDistance { get; set; }

        public string SegmentDistanceSource { get; set; }

        public int? DtcCount { get; set; }

        public double Odometer { get; set; }

        public string OdometerSource { get; set; }

        public int? FuelUsedGps { get; set; }

        public int? FuelRateGps { get; set; }

        public double? EngineLoad { get; set; }

        public double? EngineCoolantTemperature { get; set; }

        public double? FuelPressure { get; set; }

        public double? EngineRpm { get; set; }

        public double? IntakeAirTemperature { get; set; }

        public double? MafAirFlowRate { get; set; }

        public double? ThrottlePedalLevel { get; set; }

        public double? EngineRuntimeSinceStart { get; set; }

        public double? CommandedEgr { get; set; }

        public double? FuelLevel { get; set; }

        public double? FuelVolume { get; set; }

        public double? BarometricPressure { get; set; }

        public double? AmbientAirTemperature { get; set; }

        public double? EngineOilTemperature { get; set; }

        public double? FuelInjectionTiming { get; set; }

        public double? EngineFuelRate { get; set; }

        public bool? Movement { get; set; }

        public double? Pdop { get; set; }

        public double? TripOdometer { get; set; }

        public double? AxleWeight { get; set; }

        public double? BrakePedalLevel { get; set; }

        public bool? CruiseStatus { get; set; }

        public bool? DriverDoorStatus { get; set; }

        public string Dtc { get; set; }

        public double? EngineMotorHours { get; set; }

        public double? FuelConsumed { get; set; }

        public bool? TrunkStatus { get; set; }

        public double? EngineTemperature { get; set; }

        public bool? IdleStatus { get; set; }

        public bool? TowingStatus { get; set; }

        public bool? ExternalPowerSourceStatus { get; set; }

        public double? CpuTemperature { get; set; }

        public string SimImsi { get; set; }

        public string SimIccid { get; set; }

        public string AccessTechnology { get; set; }

        public int? GsmSignalLevel { get; set; }

        public double? DeviceTemperature { get; set; }

        public double? XAxisAngle { get; set; }

        public double? YAxisAngle { get; set; }

        public double? ZAxisAngle { get; set; }

        public double? CpuUtilization { get; set; }

        public bool? CrashEvent { get; set; }

        public Aqs Aqs { get; set; }

        public IEnumerable<BleBeacon> BleBeacons { get; set; }

        public Vision Vision { get; set; }

        public Adas Adas { get; set; }

        public Alpr Alpr { get; set; }

        public Dsm Dsm { get; set; }

        public Hotspot Hotspot { get; set; }

        public JToken External { get; set; }

        public bool? GeofenceExit { get; set; }

        public double? TemperatureSensor01 { get; set; }

        public double? TemperatureSensor02 { get; set; }

        public double? TemperatureSensor03 { get; set; }

        public double? TemperatureSensor04 { get; set; }

        public bool? HarshAccelerationDetected { get; set; }

        public bool? HarshBrakingDetected { get; set; }

        public bool? HarshCorneringDetected { get; set; }

        public bool? OverRevvingDetected { get; set; }

        public bool? DriverSeatBeltBuckled { get; set; }

        public bool? PassengerSeatBeltBuckled { get; set; }

        public bool? BackSeatBeltBuckled { get; set; }

        public double? GpsVelocity { get; set; }

        public double? DistanceToEmpty { get; set; }

        public double? EvBatteryLevel { get; set; }

        public double? AhtTemperature { get; set; }

        public double? InternalEtoh { get; set; }

        public double? InternalEco2 { get; set; }

        public double? InternalIaq { get; set; }

        public double? InternalLogRcda { get; set; }

        public double? InternalTvoc { get; set; }

        public double? ExternalEtoh { get; set; }

        public double? ExternalEco2 { get; set; }

        public double? ExternalIaq { get; set; }

        public double? ExternalLogRcda { get; set; }

        public double? ExternalTvoc { get; set; }

        public string EventType { get; set; }

        public bool? ChildDetected { get; set; }

        public bool? PhoneDetected { get; set; }

        public bool? SeatbeltDetected { get; set; }

        public bool? PassengerDetected { get; set; }

        public DateTime? ChildTimestamp { get; set; }

        public DateTime? PhoneTimestamp { get; set; }

        public DateTime? SeatbeltTimestamp { get; set; }

        public TelemetryVehicleRecord Vehicle { get; set; }
    }

    public class TelemetryVehicleRecord
    {
        public string Name { get; set; }

        public string PlateNo { get; set; }

        public string Number { get; set; }

        public string Vin { get; set; }

        public string Make { get; set; }

        public string Model { get; set; }

        public string Type { get; set; }

        public string FranchiseName { get; set; }
    }
}