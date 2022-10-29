import fs from 'fs';
import readline from 'readline';
import { calculateMean, calculateStandardDeviation } from '../src/utils';

enum Entity {
  THERMOMETER = 'thermometer',
  HUMIDITY = 'humidity',
  MONOXIDE = 'monoxide',
}

const SEPARATOR = ' ';
let sensors: { [key: string]: { readings: number[]; sensor: string } } = {};
let references: string[] = [];
let currentSensor = '';
let sensorReading = '';
const evaluatedSections: string[] = [];

function evaluateLogFile(filePath: string): void {
  const reader = readline.createInterface({
    input: fs.createReadStream(__dirname.concat(filePath)),
    crlfDelay: Infinity,
  });

  reader.on('line', (input: string) => {
    const [entity, ...values] = input.split(SEPARATOR);

    if (entity === 'reference') {
      references = values;
    } else if (Object.values(Entity).includes(entity as Entity)) {
      currentSensor = entity;
      sensorReading = values[0];
      if (!evaluatedSections.includes(currentSensor)) {
        evaluatedSections.push(currentSensor);
      }
    } else if (!isNaN(Date.parse(entity))) {
      if (sensors[sensorReading] === undefined) {
        sensors = {
          ...sensors,
          [sensorReading]: { readings: [+values[0]], sensor: currentSensor },
        };
      } else {
        sensors[sensorReading].readings.push(+values[0]);
      }
    }
  });

  reader.on('close', () => {
    const result = Object.entries(sensors).reduce(
      (prev, [key, { readings, sensor }]) => {
        const mean = calculateMean(readings);
        const sd = calculateStandardDeviation(readings);
        const reference = +references[evaluatedSections.indexOf(sensor)];
        let tag = '';

        const difference = Math.abs(reference - mean);
        switch (sensor) {
          case Entity.THERMOMETER: {
            tag = 'precise';

            if (difference <= 0.5 && sd < 3) {
              tag = 'ultra precise';
            } else if (difference <= 0.5 && sd < 5) {
              tag = 'very precise';
            }
            return {
              ...prev,
              [key]: tag,
            };
          }

          case Entity.HUMIDITY: {
            tag = 'keep';
            if (difference > 1) {
              tag = 'discard';
            }
            return {
              ...prev,
              [key]: tag,
            };
          }

          case Entity.MONOXIDE: {
            tag = 'keep';
            if (difference > 3) {
              tag = 'discard';
            }
            return {
              ...prev,
              [key]: tag,
            };
          }

          default:
            return prev;
        }
      },
      {}
    );
    // eslint-disable-next-line no-console
    console.log(result);
  });
}

evaluateLogFile('/assets/sensors-logs.txt');
