import '@Tests/commands/mockServices';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import FirebaseDatabase from '@Mocks/services/FirebaseDatabase';
import COACHES_DATA from '@Mocks/data/coaches.json';
import { wrapper } from '@/store';
import { listCoaches } from '@/models/coach';
import { Provider } from 'react-redux';
import Coaches from './index';

describe('coaches page', () => {
  it('renders all coaches', async () => {
    // Arrange
    const spy = jest
      .spyOn(FirebaseDatabase, 'getValue')
      .mockImplementation((path) => {
        if (path === '/coaches') {
          return COACHES_DATA;
        }
        return {};
      });
    const coachesList = await listCoaches({ bypassCDN: true });
    const WrappedComponent = () => {
      const { store } = wrapper.useWrappedStore({});
      return (
        <Provider store={store}>
          <Coaches coaches={coachesList} />
        </Provider>
      );
    };
    // Act
    render(<WrappedComponent />);
    const coachCards = screen.getAllByTestId('coachCard');
    // Assert
    expect(coachCards.length).toBe(coachesList.length);
    spy.mockRestore();
  });

  it('renders loading if no coaches', async () => {
    // Arrange
    const coachesList = [];

    const WrappedComponent = () => {
      const { store } = wrapper.useWrappedStore({});
      return (
        <Provider store={store}>
          <Coaches coaches={coachesList} />
        </Provider>
      );
    };
    // Act
    render(<WrappedComponent />);
    const loader = screen.getByTestId('loader');
    // Assert
    expect(loader).toBeVisible();
  });
});
