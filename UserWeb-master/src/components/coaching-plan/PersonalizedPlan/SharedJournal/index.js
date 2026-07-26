import React from 'react';
import Image from 'next/image';
import { getCoachName, getCoachPhoto } from '../../../../models/coach';
import Text from '../../../app/Text';
import styles from './styles';

export default function SharedJournal({ coach }) {
  return (
    <div className="container">
      <Text type="h4" weight="normal" color="b100">
        4. Private & shared journal
      </Text>
      <div className="shared-journal">
        <div className="text-container">
          <Text type="body" color="b100">
            Journal note
          </Text>
          <Text type="body2" color="g100" style={{ marginTop: 9 }}>
            I was feeling anxious today after a work project. I thought I was
            prepared but when..
          </Text>
          <div className="coach-container">
            {!!getCoachPhoto(coach, 'photo100Url') && (
              <span className="coach">
                <Image
                  src={coach && getCoachPhoto(coach, 'photo100Url')}
                  alt="coach"
                  width={24}
                  height={24}
                />
              </span>
            )}
            <Text type="body2" weight="semibold" color="b100">
              Shared with {coach && getCoachName(coach)}
            </Text>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
