import ELK from 'elkjs';
import { describe, test } from 'vitest';

describe('elk', () => {
  test('default', async () => {
    const elk = new ELK();
    const r = await elk.layout(
      {
        id: 'root',
        children: [
          {
            id: 'A',
            width: 100,
            height: 100,
            ports: [
              {
                id: 'A1',
                x: 50,
                y: 0,
              },
              {
                id: 'A2',
                x: 50,
                y: 100,
              },
            ],
            properties: {
              portConstraints: 'FIXED_POS',
            },
          },
          {
            id: 'B',
            width: 100,
            height: 100,
            ports: [
              {
                id: 'B1',
                x: 50,
                y: 0,
              },
              {
                id: 'B2',
                x: 50,
                y: 100,
              },
            ],
            properties: {
              portConstraints: 'FIXED_POS',
            },
          },
        ],
        edges: [
          {
            id: 'E',
            sources: ['A2'],
            targets: ['B1'],
          },
        ],
      },
      {
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': 'DOWN',
        },
      },
    );
    console.log(JSON.stringify(r, null, 2));
  });
});
