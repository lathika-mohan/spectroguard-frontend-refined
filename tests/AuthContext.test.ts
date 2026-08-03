import { describe, it, expect } from 'vitest';
import { mapAuthenticatedUser } from '../src/context/AuthContext';
import type { MeResponse } from '../src/context/AuthContext';

describe('AuthContext mapping & derivation', () => {
  it('maps minimal username and role correctly', () => {
    const dto: MeResponse = {
      username: 'op-4471',
      role: 'Lead Security Operator'
    };

    const user = mapAuthenticatedUser(dto);

    expect(user.id).toBe('op-4471');
    expect(user.username).toBe('op-4471');
    expect(user.displayName).toBe('op-4471');
    expect(user.initials).toBe('OP');
    expect(user.role).toBe('Lead Security Operator');
    expect(user.avatar).toBeNull();
    expect(user.email).toBeNull();
    expect(user.workspaceId).toBeNull();
    expect(user.raw).toBe(dto);
  });

  it('handles custom full names, emails, and workspaces', () => {
    const dto: MeResponse = {
      username: 'john_doe',
      role: 'Operator',
      full_name: 'John Doe',
      email: 'john@spectraguard.ai',
      workspace_id: 'org-workspace-123'
    };

    const user = mapAuthenticatedUser(dto);

    expect(user.displayName).toBe('John Doe');
    expect(user.initials).toBe('JD');
    expect(user.email).toBe('john@spectraguard.ai');
    expect(user.workspaceId).toBe('org-workspace-123');
  });

  it('generates correct initials from word patterns', () => {
    expect(mapAuthenticatedUser({ username: 'security_operator', role: 'x' }).initials).toBe('SO');
    expect(mapAuthenticatedUser({ username: 'camera-admin', role: 'x' }).initials).toBe('CA');
    expect(mapAuthenticatedUser({ username: 'op-4471', role: 'x' }).initials).toBe('OP');
    expect(mapAuthenticatedUser({ username: 'j', role: 'x' }).initials).toBe('J');
  });
});
